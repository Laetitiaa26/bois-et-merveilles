import { Router } from "express";
import type Stripe from "stripe";
import { z } from "zod";
import { env } from "../env.js";
import { stripe } from "../lib/stripe.js";
import { prisma } from "../lib/prisma.js";
import { applyPercent, getPromoPercent } from "../lib/promo.js";
import { asyncHandler, HttpError } from "../middleware/errorHandler.js";
import { attachUserIfPresent } from "../middleware/auth.js";

export const checkoutRouter = Router();

const createSessionSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1, "Le panier est vide"),
  email: z.string().email(),
  shipping: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),
  promoCode: z.string().trim().optional(),
});

checkoutRouter.post(
  "/promo",
  asyncHandler(async (req, res) => {
    const { code } = z.object({ code: z.string().trim().min(1) }).parse(req.body);
    const percent = getPromoPercent(code);
    if (percent === null) {
      throw new HttpError(404, "Ce code promo n'existe pas");
    }
    res.json({ code: code.toUpperCase(), percent });
  }),
);

checkoutRouter.post(
  "/create-session",
  attachUserIfPresent,
  asyncHandler(async (req, res) => {
    const { items, email, shipping, promoCode } = createSessionSchema.parse(req.body);

    const promoPercent = getPromoPercent(promoCode);
    if (promoCode && promoPercent === null) {
      throw new HttpError(400, "Ce code promo n'existe pas");
    }

    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds }, active: true } });

    if (products.length !== productIds.length) {
      throw new HttpError(400, "Un ou plusieurs produits sont introuvables");
    }

    let subtotalCents = 0;
    let totalCents = 0;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      if (product.stock < item.quantity) {
        throw new HttpError(400, `Stock insuffisant pour "${product.name}"`);
      }
      // La réduction est appliquée sur chaque prix unitaire pour que le
      // montant affiché par Stripe corresponde exactement au total de la commande.
      const unitAmount = promoPercent ? applyPercent(product.priceCents, promoPercent) : product.priceCents;
      subtotalCents += product.priceCents * item.quantity;
      totalCents += unitAmount * item.quantity;
      lineItems.push({
        quantity: item.quantity,
        price_data: {
          currency: product.currency,
          unit_amount: unitAmount,
          product_data: { name: product.name },
        },
      });
      return {
        productId: product.id,
        quantity: item.quantity,
        unitPriceCents: product.priceCents,
      };
    });

    const order = await prisma.order.create({
      data: {
        userId: req.userId,
        email,
        totalCents,
        promoCode: promoPercent ? promoCode!.toUpperCase() : null,
        discountCents: subtotalCents - totalCents,
        shippingName: shipping.name,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingPostalCode: shipping.postalCode,
        shippingCountry: shipping.country,
        items: { create: orderItemsData },
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: lineItems,
      success_url: `${env.CLIENT_URL}/commande/succes?order=${order.id}`,
      cancel_url: `${env.CLIENT_URL}/commande/annulee?order=${order.id}`,
      metadata: { orderId: order.id },
    });

    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });

    res.json({ url: session.url });
  }),
);

// Route montée avec express.raw() dans index.ts pour vérifier la signature Stripe.
export const stripeWebhookHandler = asyncHandler(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  if (!signature || typeof signature !== "string") {
    throw new HttpError(400, "Signature Stripe manquante");
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    throw new HttpError(400, `Signature Stripe invalide: ${(err as Error).message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
      if (order && order.status === "PENDING") {
        await prisma.$transaction([
          prisma.order.update({ where: { id: orderId }, data: { status: "PAID" } }),
          ...order.items.map((item) =>
            prisma.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            }),
          ),
        ]);
      }
    }
  }

  // Stripe fait expirer une session non payée au bout de 24 h : la commande est alors abandonnée
  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await prisma.order.updateMany({ where: { id: orderId, status: "PENDING" }, data: { status: "CANCELLED" } });
    }
  }

  res.json({ received: true });
});

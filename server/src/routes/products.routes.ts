import { Router } from "express";
import { z } from "zod";
import { parseMinAgeMonths } from "../lib/age.js";
import { prisma } from "../lib/prisma.js";
import { withRatings } from "../lib/ratings.js";
import { asyncHandler, HttpError } from "../middleware/errorHandler.js";
import { attachUserIfPresent, requireAuth } from "../middleware/auth.js";

export const productsRouter = Router();

const listQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["price-asc", "price-desc", "newest"]).optional(),
  // Âge de l'enfant en mois : on ne garde que les jouets conseillés à cet âge
  age: z.coerce.number().int().min(0).optional(),
  featured: z
    .string()
    .optional()
    .transform((v) => v === "true"),
});

productsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { category, search, sort, age, featured } = listQuerySchema.parse(req.query);

    const products = await prisma.product.findMany({
      where: {
        active: true,
        ...(category ? { category: { slug: category } } : {}),
        ...(featured ? { featured: true } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { category: true },
      orderBy:
        sort === "price-asc"
          ? { priceCents: "asc" }
          : sort === "price-desc"
            ? { priceCents: "desc" }
            : { createdAt: "desc" },
    });

    const filtered =
      age === undefined ? products : products.filter((product) => parseMinAgeMonths(product.ageRange) <= age);

    res.json({ products: await withRatings(filtered) });
  }),
);

async function findActiveProduct(slug: string) {
  const product = await prisma.product.findUnique({ where: { slug }, include: { category: true } });
  if (!product || !product.active) {
    throw new HttpError(404, "Produit introuvable");
  }
  return product;
}

// Avis mis en avant sur la page d'accueil : les plus récents parmi les 4 et 5 étoiles.
// Déclarée avant "/:slug" pour ne pas être interprétée comme un slug de produit.
productsRouter.get(
  "/reviews/highlights",
  asyncHandler(async (_req, res) => {
    const reviews = await prisma.review.findMany({
      where: { approved: true, rating: { gte: 4 }, product: { active: true } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true, slug: true } },
      },
    });

    res.json({
      reviews: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        authorName: publicAuthorName(review.user),
        product: review.product,
      })),
    });
  }),
);

productsRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const product = await findActiveProduct(req.params.slug);

    const related = await prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: product.id }, active: true },
      take: 4,
      include: { category: true },
    });

    const [productWithRating] = await withRatings([product]);
    res.json({ product: productWithRating, related: await withRatings(related) });
  }),
);

// Affiche "Prénom N." pour ne pas exposer le nom complet des clients.
function publicAuthorName(user: { name: string | null; email: string }) {
  const parts = (user.name ?? user.email.split("@")[0]).trim().split(/\s+/);
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.` : parts[0];
}

productsRouter.get(
  "/:slug/reviews",
  attachUserIfPresent,
  asyncHandler(async (req, res) => {
    const product = await findActiveProduct(req.params.slug);

    // Avis validés, plus celui du visiteur connecté pour qu'il voie le sien en attente de validation
    const reviews = await prisma.review.findMany({
      where: {
        productId: product.id,
        OR: [{ approved: true }, ...(req.userId ? [{ userId: req.userId }] : [])],
      },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    const buyers = await prisma.orderItem.findMany({
      where: { productId: product.id, order: { status: "PAID", userId: { in: reviews.map((r) => r.userId) } } },
      select: { order: { select: { userId: true } } },
    });
    const verifiedUserIds = new Set(buyers.map((item) => item.order.userId));

    res.json({
      reviews: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        userId: review.userId,
        authorName: publicAuthorName(review.user),
        verifiedPurchase: verifiedUserIds.has(review.userId),
        approved: review.approved,
      })),
    });
  }),
);

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(3, "Votre avis doit contenir au moins 3 caractères").max(1000),
});

// Un avis par client et par produit : republier modifie l'avis existant.
// Tout avis nouveau ou modifié repasse en attente de validation par l'admin.
productsRouter.post(
  "/:slug/reviews",
  requireAuth,
  asyncHandler(async (req, res) => {
    const product = await findActiveProduct(req.params.slug);
    const { rating, comment } = reviewSchema.parse(req.body);
    const userId = req.userId!;

    const review = await prisma.review.upsert({
      where: { userId_productId: { userId, productId: product.id } },
      update: { rating, comment, approved: false },
      create: { rating, comment, userId, productId: product.id },
    });

    res.status(201).json({ review });
  }),
);

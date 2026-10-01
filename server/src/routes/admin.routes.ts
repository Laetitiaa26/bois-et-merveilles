import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { slugify } from "../lib/slug.js";
import { saveProductImage } from "../lib/uploads.js";
import { asyncHandler, HttpError } from "../middleware/errorHandler.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const [productCount, orderCount, paidOrders, subscriberCount, lowStockCount, pendingReviewCount] =
      await Promise.all([
        prisma.product.count({ where: { active: true } }),
        prisma.order.count(),
        prisma.order.aggregate({ where: { status: "PAID" }, _sum: { totalCents: true }, _count: true }),
        prisma.newsletterSubscriber.count(),
        prisma.product.count({ where: { active: true, stock: { lte: 5 } } }),
        prisma.review.count({ where: { approved: false } }),
      ]);
    res.json({
      productCount,
      orderCount,
      paidOrderCount: paidOrders._count,
      revenueCents: paidOrders._sum.totalCents ?? 0,
      subscriberCount,
      lowStockCount,
      pendingReviewCount,
    });
  }),
);

// --- Produits ---

adminRouter.get(
  "/products",
  asyncHandler(async (_req, res) => {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
      include: { category: true, _count: { select: { orderItems: true } } },
    });
    res.json({ products });
  }),
);

const productSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(10),
  priceCents: z.number().int().positive(),
  stock: z.number().int().min(0),
  categoryId: z.string().min(1),
  imageUrl: z.string().trim().min(1).nullable(),
  images: z.array(z.string().trim().min(1)).max(8),
  material: z.string().trim().nullable(),
  ageRange: z.string().trim().nullable(),
  featured: z.boolean(),
  isNew: z.boolean(),
  active: z.boolean(),
});

async function uniqueSlug(name: string, excludeId?: string) {
  const base = slugify(name) || "produit";
  let slug = base;
  for (let i = 2; ; i++) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${i}`;
  }
}

// L'illustration de secours (quand il n'y a pas de photo) suit celle des
// autres produits de la catégorie.
async function categoryVisuals(categoryId: string) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    throw new HttpError(400, "Catégorie introuvable");
  }
  const sibling = await prisma.product.findFirst({ where: { categoryId } });
  return { illustrationKey: sibling?.illustrationKey ?? "blocks", accentColor: sibling?.accentColor ?? "sage" };
}

adminRouter.post(
  "/products",
  asyncHandler(async (req, res) => {
    const data = productSchema.parse(req.body);
    const product = await prisma.product.create({
      data: {
        ...data,
        ...(await categoryVisuals(data.categoryId)),
        slug: await uniqueSlug(data.name),
      },
      include: { category: true },
    });
    res.status(201).json({ product });
  }),
);

adminRouter.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const data = productSchema.partial().parse(req.body);
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      throw new HttpError(404, "Produit introuvable");
    }

    const product = await prisma.product.update({
      where: { id: existing.id },
      data: {
        ...data,
        ...(data.categoryId && data.categoryId !== existing.categoryId ? await categoryVisuals(data.categoryId) : {}),
        ...(data.name && data.name !== existing.name ? { slug: await uniqueSlug(data.name, existing.id) } : {}),
      },
      include: { category: true },
    });
    res.json({ product });
  }),
);

adminRouter.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const orderItemCount = await prisma.orderItem.count({ where: { productId: req.params.id } });
    if (orderItemCount > 0) {
      throw new HttpError(409, "Ce produit figure dans des commandes : masquez-le plutôt que de le supprimer.");
    }
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
  }),
);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => callback(null, file.mimetype.startsWith("image/")),
});

adminRouter.post(
  "/uploads",
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new HttpError(400, "Aucune image reçue (formats acceptés : JPG, PNG, WebP)");
    }
    const fileName = await saveProductImage(req.file.buffer, req.file.originalname);
    res.status(201).json({ url: `${req.protocol}://${req.get("host")}/uploads/${fileName}` });
  }),
);

// --- Commandes ---

adminRouter.get(
  "/orders",
  asyncHandler(async (_req, res) => {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } },
    });
    res.json({ orders });
  }),
);

adminRouter.patch(
  "/orders/:id",
  asyncHandler(async (req, res) => {
    const { status } = z.object({ status: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED"]) }).parse(req.body);
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { items: { include: { product: true } } },
    });
    res.json({ order });
  }),
);

// Modération des avis : ceux en attente d'abord, puis les plus récents
adminRouter.get(
  "/reviews",
  asyncHandler(async (_req, res) => {
    const reviews = await prisma.review.findMany({
      orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true, slug: true, imageUrl: true, illustrationKey: true, accentColor: true } },
      },
    });
    res.json({ reviews });
  }),
);

adminRouter.patch(
  "/reviews/:id",
  asyncHandler(async (req, res) => {
    const { approved } = z.object({ approved: z.boolean() }).parse(req.body);
    const review = await prisma.review.update({ where: { id: req.params.id }, data: { approved } });
    res.json({ review });
  }),
);

adminRouter.delete(
  "/reviews/:id",
  asyncHandler(async (req, res) => {
    await prisma.review.delete({ where: { id: req.params.id } });
    res.status(204).send();
  }),
);

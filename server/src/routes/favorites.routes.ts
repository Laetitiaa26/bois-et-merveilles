import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { withRatings } from "../lib/ratings.js";
import { asyncHandler, HttpError } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";

export const favoritesRouter = Router();

favoritesRouter.use(requireAuth);

favoritesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.userId, product: { active: true } },
      orderBy: { createdAt: "desc" },
      include: { product: { include: { category: true } } },
    });
    res.json({ products: await withRatings(favorites.map((favorite) => favorite.product)) });
  }),
);

favoritesRouter.post(
  "/:productId",
  asyncHandler(async (req, res) => {
    const productId = req.params.productId;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new HttpError(404, "Produit introuvable");
    }
    await prisma.favorite.upsert({
      where: { userId_productId: { userId: req.userId!, productId } },
      update: {},
      create: { userId: req.userId!, productId },
    });
    res.status(204).send();
  }),
);

favoritesRouter.delete(
  "/:productId",
  asyncHandler(async (req, res) => {
    await prisma.favorite.deleteMany({ where: { userId: req.userId, productId: req.params.productId } });
    res.status(204).send();
  }),
);

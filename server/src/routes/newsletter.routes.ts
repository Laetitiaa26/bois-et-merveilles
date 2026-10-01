import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { WELCOME_PROMO_CODE } from "../lib/promo.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const newsletterRouter = Router();

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse email invalide"),
});

newsletterRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { email } = subscribeSchema.parse(req.body);
    await prisma.newsletterSubscriber.upsert({ where: { email }, update: {}, create: { email } });
    res.status(201).json({ promoCode: WELCOME_PROMO_CODE });
  }),
);

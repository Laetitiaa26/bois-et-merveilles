import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL est requis"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET est requis"),
  CLIENT_URL: z.string().min(1).default("http://localhost:5173"),
  PORT: z.coerce.number().default(4000),
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY est requis"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET est requis"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Variables d'environnement invalides :", parsed.error.flatten().fieldErrors);
  throw new Error("Configuration d'environnement invalide, voir .env.example");
}

export const env = parsed.data;

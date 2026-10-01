import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./env.js";
import { UPLOADS_DIR } from "./lib/uploads.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { adminRouter } from "./routes/admin.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { categoriesRouter } from "./routes/categories.routes.js";
import { checkoutRouter, stripeWebhookHandler } from "./routes/checkout.routes.js";
import { favoritesRouter } from "./routes/favorites.routes.js";
import { newsletterRouter } from "./routes/newsletter.routes.js";
import { ordersRouter } from "./routes/orders.routes.js";
import { productsRouter } from "./routes/products.routes.js";

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const localhostOrigin = /^http:\/\/localhost:\d+$/;

app.use(
  cors({
    // En dev, le port du serveur Vite peut changer (5173, 5174, ...) si un autre
    // process occupe déjà le port par défaut : on accepte donc tout localhost.
    origin: isProduction ? env.CLIENT_URL : (origin, callback) => callback(null, !origin || localhostOrigin.test(origin)),
    credentials: true,
  }),
);

// Le webhook Stripe a besoin du corps brut pour vérifier la signature,
// donc il est monté avant express.json() avec son propre parseur.
app.post("/api/checkout/webhook", express.raw({ type: "application/json" }), stripeWebhookHandler);

app.use(express.json());
app.use(cookieParser());

// Photos envoyées depuis l'espace admin (converties en WebP)
app.use("/uploads", express.static(UPLOADS_DIR, { maxAge: "30d", immutable: true }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/admin", adminRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`API jouetbois lancée sur http://localhost:${env.PORT}`);
});

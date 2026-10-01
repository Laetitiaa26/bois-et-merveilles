# Bois & Merveilles — boutique de jouets en bois

Site e-commerce (portfolio) pour une boutique de jouets en bois / Montessori.

- **Frontend** : React 19 + Vite + TypeScript + Tailwind CSS v4 (racine du repo)
- **Backend** : Node.js + Express + Prisma + PostgreSQL (`server/`)
- **Paiement** : Stripe Checkout (mode test)

## 1. Base de données PostgreSQL

Le backend a besoin d'une URL `DATABASE_URL`. Deux options :

### Option A — Docker (local)

Si tu as [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé :

```bash
docker compose up -d
```

Cela lance un Postgres local sur `localhost:5432` (utilisateur/mot de passe/db : `jouetbois`). C'est l'URL déjà présente dans `server/.env.example`, donc rien à changer.

### Option B — Base hébergée gratuite (sans Docker)

Crée une base Postgres gratuite chez [Neon](https://neon.tech), [Supabase](https://supabase.com) (utiliser uniquement la base Postgres) ou [Railway](https://railway.app), puis copie l'URL de connexion fournie dans `DATABASE_URL`.

## 2. Stripe (mode test)

1. Crée un compte [Stripe](https://dashboard.stripe.com/register) (gratuit).
2. Récupère ta clé secrète de test sur https://dashboard.stripe.com/test/apikeys → `STRIPE_SECRET_KEY`.
3. Installe la [Stripe CLI](https://docs.stripe.com/stripe-cli) pour recevoir les webhooks en local :
   ```bash
   stripe login
   stripe listen --forward-to localhost:4000/api/checkout/webhook
   ```
   La commande affiche un secret `whsec_...` à mettre dans `STRIPE_WEBHOOK_SECRET`.

Pour tester un paiement, utilise la carte de test `4242 4242 4242 4242`, n'importe quelle date future et n'importe quel CVC.

## 3. Lancer le backend

```bash
cd server
cp .env.example .env    # puis renseigne DATABASE_URL / STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET
pnpm install
pnpm prisma:generate
pnpm prisma:migrate      # crée les tables
pnpm prisma:seed         # remplit le catalogue de démonstration
pnpm dev                 # démarre l'API sur http://localhost:4000
```

## 4. Lancer le frontend

Dans un autre terminal, à la racine du repo :

```bash
cp .env.example .env
pnpm install
pnpm dev                 # démarre le site sur http://localhost:5173
```

## 5. Espace administrateur

1. Crée un compte depuis la page « Inscription » du site.
2. Donne-lui le rôle administrateur :
   ```bash
   cd server
   pnpm make-admin ton-email@exemple.fr
   ```
3. Reconnecte-toi : un lien « Admin » apparaît dans l'en-tête (`/admin`).

L'espace admin permet d'ajouter, modifier, masquer ou supprimer des produits (avec envoi de photos, converties automatiquement en WebP dans `server/uploads/`) et de suivre les commandes.

> `pnpm prisma:sync` réécrit les produits définis dans `server/prisma/catalog.ts`. Une modification faite depuis l'admin sur un de ces produits sera donc écrasée à la prochaine synchro ; les produits créés depuis l'admin ne sont pas touchés.

## Fonctionnalités

- Boutique avec recherche, filtre par catégorie et par âge de l'enfant, tri par prix ou nouveautés
- Favoris (compte requis), avis clients avec note et badge « Achat vérifié »
- Galerie de photos sur les fiches produits
- Newsletter avec code de bienvenue `BIENVENUE10` (-10 %), utilisable au paiement
- Pages « Notre histoire », mentions légales, CGV, livraison & retours
- Photos en WebP (les originaux sont conservés dans `photos-originales/`, hors du site)

## Structure du projet

```
src/            frontend (pages, composants, contextes panier/auth)
server/         backend Express + Prisma
  prisma/       schéma de base de données et script de seed
  src/routes/   routes API (auth, produits, catégories, checkout, commandes)
docker-compose.yml   Postgres pour le développement local
```

## Notes

- Les visuels produits sont des illustrations SVG générées en interne (aucune dépendance à des photos externes) — à remplacer par de vraies photos si besoin, voir `src/components/ProductIllustration.tsx`.
- Le panier est stocké côté client (`localStorage`) ; les prix sont toujours recalculés côté serveur au moment du paiement.
- L'authentification utilise un cookie `httpOnly` signé (JWT) ; la commande est possible avec ou sans compte.

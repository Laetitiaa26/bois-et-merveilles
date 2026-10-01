// Remplit la base avec des données fictives pour présenter l'espace admin :
//   pnpm demo-data          crée clients, commandes, avis et inscrits newsletter
//   pnpm demo-data --reset  supprime uniquement ces données de démo
// Toutes les adresses fictives se terminent par @example.com, ce qui permet de les retrouver.
import { PrismaClient, type OrderStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const prisma = new PrismaClient();
const DEMO_DOMAIN = "@example.com";

const customers = [
  { name: "Camille Durand", city: "Lyon", postalCode: "69003", address: "12 rue Paul Bert" },
  { name: "Julien Martin", city: "Nantes", postalCode: "44000", address: "4 allée des Tanneurs" },
  { name: "Sophie Bernard", city: "Bordeaux", postalCode: "33000", address: "27 cours Victor Hugo" },
  { name: "Thomas Petit", city: "Lille", postalCode: "59000", address: "8 rue de la Monnaie" },
  { name: "Léa Moreau", city: "Toulouse", postalCode: "31000", address: "15 rue du Taur" },
  { name: "Hugo Laurent", city: "Rennes", postalCode: "35000", address: "3 place Sainte-Anne" },
  { name: "Manon Garcia", city: "Montpellier", postalCode: "34000", address: "21 rue de l'Aiguillerie" },
  { name: "Nicolas Roux", city: "Strasbourg", postalCode: "67000", address: "9 quai des Bateliers" },
];

// Commandes passées sans compte (invité)
const guests = [
  { name: "Claire Fontaine", city: "Annecy", postalCode: "74000", address: "6 rue Royale" },
  { name: "Antoine Mercier", city: "Dijon", postalCode: "21000", address: "18 rue des Forges" },
];

// [index client (ou "g0"/"g1" pour un invité), il y a N jours, statut, produits [slug, quantité], code promo ?]
type OrderSpec = [number | `g${number}`, number, OrderStatus, [string, number][], string?];
const orders: OrderSpec[] = [
  [0, 41, "PAID", [["petit-train-en-bois-roues-pastel", 1], ["cubes-en-bois-colores-24-pieces", 1]]],
  [1, 38, "PAID", [["licorne-a-bascule", 1]], "BIENVENUE10"],
  [2, 35, "PAID", [["xylophone-arc-en-ciel", 1], ["maracas-pastel-lot-de-3", 1]]],
  ["g0", 33, "PAID", [["grande-maison-de-poupee-en-bois", 1]]],
  [3, 30, "CANCELLED", [["circuit-de-train-en-bois", 1]]],
  [4, 27, "PAID", [["empileur-arc-en-ciel-geant", 1], ["pyramide-d-anneaux-bleu-ocean", 1]], "BIENVENUE10"],
  [0, 24, "PAID", [["puzzle-animaux-a-encastrer", 2]]],
  [5, 21, "PAID", [["cuisine-en-bois-avec-accessoires", 1], ["cagette-de-fruits-a-decouper", 1]]],
  [6, 18, "FAILED", [["ensemble-de-motricite-pikler", 1]]],
  [6, 18, "PAID", [["ensemble-de-motricite-pikler", 1]]],
  [7, 15, "PAID", [["dinosaures-et-arbres-lot-de-13", 1], ["toupies-en-bois-lot-de-3", 2]]],
  ["g1", 12, "PAID", [["piano-a-queue-rose-et-son-tabouret", 1]], "BIENVENUE10"],
  [2, 9, "PAID", [["planche-d-equilibre", 1]]],
  [3, 7, "PAID", [["bus-en-bois-et-ses-passagers", 1], ["appareil-photo-en-bois", 1]]],
  [1, 5, "PAID", [["mallette-de-docteur-personnalisable", 1]]],
  [4, 3, "PAID", [["cube-d-activites-labyrinthe", 1]]],
  [5, 2, "CANCELLED", [["poussette-de-poupee-fleurie", 1]]],
  [7, 1, "PAID", [["coffret-de-blocs-naturels-60-pieces", 1], ["boulier-100-perles-tons-naturels", 1]]],
  [0, 0, "PENDING", [["bateaux-a-voile-en-bois-lot-de-5", 1]]],
];

// Avis laissés par des clients ayant réellement acheté le produit (badge « Achat vérifié »)
const reviews: [number, string, number, string][] = [
  [0, "petit-train-en-bois-roues-pastel", 5, "Très bien fini, les roues tournent parfaitement. Mon fils de 2 ans ne le lâche plus !"],
  [0, "cubes-en-bois-colores-24-pieces", 4, "Jolies couleurs et bois bien poncé. J'aurais aimé une boîte de rangement."],
  [1, "licorne-a-bascule", 5, "Un vrai coup de cœur, solide et magnifique. Elle trône dans la chambre."],
  [2, "xylophone-arc-en-ciel", 5, "Le son est juste et doux, rien à voir avec les xylophones en plastique."],
  [4, "empileur-arc-en-ciel-geant", 5, "Utilisé de mille façons : tunnel, pont, berceau… Indispensable."],
  [5, "cuisine-en-bois-avec-accessoires", 4, "Montage un peu long mais le résultat est superbe. Les accessoires sont nombreux."],
  [6, "ensemble-de-motricite-pikler", 5, "Investissement qui vaut le coup, très stable. Ma fille grimpe en toute confiance."],
  [7, "dinosaures-et-arbres-lot-de-13", 5, "Les dinosaures sont adorables, parfait pour les histoires inventées."],
  [2, "planche-d-equilibre", 4, "Belle finition, sert aussi de toboggan. Un peu encombrante."],
  [3, "bus-en-bois-et-ses-passagers", 5, "Les petits passagers sont trop mignons. Livraison rapide."],
];

const newsletterNames = ["emma.leroy", "lucas.simon", "chloe.michel", "louis.lefebvre", "ines.david", "paul.bertrand"];

const emailFor = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, ".") + DEMO_DOMAIN;

const daysAgo = (days: number, hour = 10) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour + (days % 9), (days * 7) % 60, 0, 0);
  return date;
};

async function reset() {
  const demoUsers = await prisma.user.findMany({ where: { email: { endsWith: DEMO_DOMAIN } }, select: { id: true } });
  const userIds = demoUsers.map((u) => u.id);
  await prisma.order.deleteMany({ where: { OR: [{ email: { endsWith: DEMO_DOMAIN } }, { userId: { in: userIds } }] } });
  // Les avis et favoris sont supprimés en cascade avec les comptes
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.newsletterSubscriber.deleteMany({ where: { email: { endsWith: DEMO_DOMAIN } } });
}

async function main() {
  await reset();
  if (process.argv.includes("--reset")) {
    console.log("Données de démo supprimées.");
    return;
  }

  const products = new Map(
    (await prisma.product.findMany({ select: { id: true, slug: true, priceCents: true } })).map((p) => [p.slug, p]),
  );
  const productBySlug = (slug: string) => {
    const product = products.get(slug);
    if (!product) throw new Error(`Produit introuvable : ${slug}`);
    return product;
  };

  // Mot de passe aléatoire : ces comptes ne sont pas destinés à se connecter
  const passwordHash = await bcrypt.hash(randomBytes(24).toString("hex"), 10);
  const users = [];
  for (const [i, customer] of customers.entries()) {
    users.push(
      await prisma.user.create({
        data: { email: emailFor(customer.name), name: customer.name, passwordHash, createdAt: daysAgo(45 - i * 3) },
      }),
    );
  }

  for (const [who, days, status, items, promoCode] of orders) {
    const isGuest = typeof who === "string";
    const customer = isGuest ? guests[Number(who.slice(1))] : customers[who];
    const subtotal = items.reduce((sum, [slug, qty]) => sum + productBySlug(slug).priceCents * qty, 0);
    const discountCents = promoCode ? Math.round(subtotal * 0.1) : 0;

    await prisma.order.create({
      data: {
        userId: isGuest ? null : users[who].id,
        email: emailFor(customer.name),
        status,
        totalCents: subtotal - discountCents,
        promoCode,
        discountCents,
        shippingName: customer.name,
        shippingAddress: customer.address,
        shippingCity: customer.city,
        shippingPostalCode: customer.postalCode,
        shippingCountry: "France",
        createdAt: daysAgo(days),
        items: {
          create: items.map(([slug, quantity]) => {
            const product = productBySlug(slug);
            return { productId: product.id, quantity, unitPriceCents: product.priceCents };
          }),
        },
      },
    });
  }

  for (const [who, slug, rating, comment] of reviews) {
    await prisma.review.create({
      data: { userId: users[who].id, productId: productBySlug(slug).id, rating, comment, approved: true, createdAt: daysAgo(2) },
    });
  }

  for (const [i, name] of newsletterNames.entries()) {
    await prisma.newsletterSubscriber.create({ data: { email: name + DEMO_DOMAIN, createdAt: daysAgo(30 - i * 5) } });
  }

  console.log(
    `Données de démo créées : ${users.length} clients, ${orders.length} commandes, ${reviews.length} avis, ${newsletterNames.length} inscrits newsletter.`,
  );
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

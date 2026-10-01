import { prisma } from "./prisma.js";

export interface RatingSummary {
  averageRating: number | null;
  reviewCount: number;
}

// Ajoute la note moyenne et le nombre d'avis à une liste de produits
// en une seule requête groupée.
export async function withRatings<T extends { id: string }>(products: T[]): Promise<(T & RatingSummary)[]> {
  const groups = await prisma.review.groupBy({
    by: ["productId"],
    where: { approved: true, productId: { in: products.map((product) => product.id) } },
    _avg: { rating: true },
    _count: { _all: true },
  });
  const byProduct = new Map(groups.map((group) => [group.productId, group]));

  return products.map((product) => {
    const group = byProduct.get(product.id);
    return {
      ...product,
      averageRating: group?._avg.rating ?? null,
      reviewCount: group?._count._all ?? 0,
    };
  });
}

// Synchronise la base avec catalog.ts (commandes et comptes conservés ;
// seules les catégories listées dans removedCategories sont supprimées). À relancer après chaque modification du catalogue :
//   pnpm prisma:sync
import { PrismaClient } from "@prisma/client";
import { categories, removedCategories, renamedProducts, slugify } from "./catalog";

const prisma = new PrismaClient();

async function main() {
  for (const [oldSlug, newSlug] of Object.entries(renamedProducts)) {
    const [oldProduct, newProduct] = await Promise.all([
      prisma.product.findUnique({ where: { slug: oldSlug } }),
      prisma.product.findUnique({ where: { slug: newSlug } }),
    ]);
    if (oldProduct && !newProduct) {
      await prisma.product.update({ where: { slug: oldSlug }, data: { slug: newSlug } });
    }
  }

  for (const category of categories) {
    const { products, ...categoryData } = category;
    const categoryFields = {
      name: categoryData.name,
      tagline: categoryData.tagline,
      imageUrl: categoryData.imageUrl ?? null,
    };
    const savedCategory = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: categoryFields,
      create: { slug: categoryData.slug, ...categoryFields },
    });

    for (const product of products) {
      const slug = slugify(product.name);
      const productFields = {
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        imageUrl: product.imageUrl ?? null,
        images: product.images ?? [],
        material: product.material,
        ageRange: product.ageRange,
        featured: product.featured,
        isNew: product.isNew ?? false,
        illustrationKey: categoryData.illustrationKey,
        accentColor: categoryData.accentColor,
        categoryId: savedCategory.id,
      };
      await prisma.product.upsert({
        where: { slug },
        update: productFields,
        create: { slug, ...productFields },
      });
    }
  }

  for (const slug of removedCategories) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { products: { include: { _count: { select: { orderItems: true } } } } },
    });
    if (!category) continue;

    const deletable = category.products.filter((product) => product._count.orderItems === 0);
    await prisma.product.deleteMany({ where: { id: { in: deletable.map((product) => product.id) } } });

    if (deletable.length === category.products.length) {
      await prisma.category.delete({ where: { id: category.id } });
    } else {
      console.warn(`Catégorie "${slug}" conservée : certains produits figurent dans des commandes.`);
    }
  }

  console.log("Catalogue synchronisé.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

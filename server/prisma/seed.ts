import { PrismaClient } from "@prisma/client";
import { categories, slugify } from "./catalog";

const prisma = new PrismaClient();

async function main() {
  console.log("Nettoyage des données existantes...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  for (const category of categories) {
    const { products, ...categoryData } = category;
    const createdCategory = await prisma.category.create({
      data: {
        slug: categoryData.slug,
        name: categoryData.name,
        tagline: categoryData.tagline,
        imageUrl: categoryData.imageUrl,
      },
    });

    for (const product of products) {
      await prisma.product.create({
        data: {
          slug: slugify(product.name),
          name: product.name,
          description: product.description,
          priceCents: product.priceCents,
          imageUrl: product.imageUrl,
          images: product.images ?? [],
          material: product.material,
          ageRange: product.ageRange,
          featured: product.featured,
          isNew: product.isNew ?? false,
          illustrationKey: categoryData.illustrationKey,
          accentColor: categoryData.accentColor,
          categoryId: createdCategory.id,
        },
      });
    }
  }

  console.log("Seed terminé avec succès.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

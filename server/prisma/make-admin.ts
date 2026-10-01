// Donne le rôle administrateur à un compte existant :
//   pnpm make-admin prenom@exemple.fr
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    throw new Error("Indique l'email du compte : pnpm make-admin prenom@exemple.fr");
  }

  const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: "insensitive" } } });
  if (!user) {
    throw new Error(`Aucun compte avec l'email ${email}. Crée d'abord le compte depuis la page d'inscription du site.`);
  }

  await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
  console.log(`${user.email} est maintenant administrateur.`);
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

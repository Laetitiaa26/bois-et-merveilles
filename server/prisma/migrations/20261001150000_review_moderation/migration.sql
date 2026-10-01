-- AlterTable
ALTER TABLE "Review" ADD COLUMN "approved" BOOLEAN NOT NULL DEFAULT false;

-- Les avis publiés avant la mise en place de la modération restent visibles
UPDATE "Review" SET "approved" = true;

import { randomBytes } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { slugify } from "./slug.js";

export const UPLOADS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../uploads");

// Redimensionne et convertit la photo en WebP : une photo d'appareil de
// plusieurs Mo tombe à ~200 Ko sans perte visible sur le site.
export async function saveProductImage(buffer: Buffer, originalName: string): Promise<string> {
  await mkdir(UPLOADS_DIR, { recursive: true });
  const baseName = slugify(path.parse(originalName).name) || "photo";
  const fileName = `${baseName}-${randomBytes(4).toString("hex")}.webp`;

  await sharp(buffer)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(UPLOADS_DIR, fileName));

  return fileName;
}

import { eq } from "drizzle-orm";
import { db, gardeningHacks } from "@/db";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

export async function createUniqueHackSlug(title: string, existingId?: number) {
  const baseSlug = slugify(title) || "garden-hack";
  let slug = baseSlug;
  let index = 2;

  while (true) {
    const existing = await db.query.gardeningHacks.findFirst({
      where: eq(gardeningHacks.slug, slug),
      columns: {
        id: true,
      },
    });

    if (!existing || existing.id === existingId) {
      return slug;
    }

    slug = `${baseSlug}-${index}`;
    index += 1;
  }
}

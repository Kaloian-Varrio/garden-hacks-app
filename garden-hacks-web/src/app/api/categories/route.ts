import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { categories, db } from "@/db";

export async function GET() {
  const rows = await db
    .select({
      id: categories.id,
      title: categories.title,
      slug: categories.slug,
      description: categories.description,
    })
    .from(categories)
    .orderBy(asc(categories.title));

  return NextResponse.json({ categories: rows });
}


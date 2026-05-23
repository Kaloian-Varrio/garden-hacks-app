import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, users } from "@/db";
import { hashPassword } from "@/lib/auth/password";
import { isValidEmail, normalizeEmail, readStringField } from "@/lib/auth/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = readStringField(body, "name");
  const email = normalizeEmail(readStringField(body, "email"));
  const password = readStringField(body, "password");
  const confirmPassword = readStringField(body, "confirmPassword");

  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { error: "Name, email, password, and confirmation are required." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters long." },
      { status: 400 },
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Password and confirmation do not match." },
      { status: 400 },
    );
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: {
      id: true,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash,
      role: "user",
      pointsBalance: 0,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      pointsBalance: users.pointsBalance,
    });

  return NextResponse.json({ user }, { status: 201 });
}

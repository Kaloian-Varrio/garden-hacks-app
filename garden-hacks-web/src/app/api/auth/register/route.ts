import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, users } from "@/db";
import { hashPassword } from "@/lib/auth/password";
import { createJwtToken, getAuthCookieOptions, AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { isValidEmail, normalizeEmail, readStringField } from "@/lib/auth/validation";
import { validationError } from "@/lib/api/http";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = readStringField(body, "name");
  const email = normalizeEmail(readStringField(body, "email"));
  const password = readStringField(body, "password");
  const confirmPassword = readStringField(body, "confirmPassword");
  const details: Record<string, string> = {};

  if (!name) {
    details.name = "Name is required.";
  }

  if (!email) {
    details.email = "Email is required.";
  }

  if (!password) {
    details.password = "Password is required.";
  }

  if (Object.keys(details).length > 0) {
    return validationError(details);
  }

  if (!isValidEmail(email)) {
    return validationError({ email: "Please enter a valid email address." });
  }

  if (password.length < 5) {
    return validationError({
      password: "Password must be at least 5 characters long.",
    });
  }

  if (confirmPassword && password !== confirmPassword) {
    return validationError({
      confirmPassword: "Password and confirmation do not match.",
    });
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
      photoUrl: users.photoUrl,
    });

  const token = createJwtToken(user);
  const response = NextResponse.json({ token, user }, { status: 201 });

  response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

  return response;
}

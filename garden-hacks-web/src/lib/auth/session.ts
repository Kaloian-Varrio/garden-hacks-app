import "server-only";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db, users } from "@/db";

export const AUTH_COOKIE_NAME = "garden_hacks_session";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
  pointsBalance: number;
  photoUrl: string | null;
};

type JwtPayload = {
  sub: string;
  email: string;
  role: "user" | "admin";
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production.");
  }

  return "garden-hacks-local-development-secret";
}

export function createJwtToken(user: Pick<AuthUser, "id" | "email" | "role">) {
  const payload: JwtPayload = {
    sub: String(user.id),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: SESSION_MAX_AGE_SECONDS,
  });
}

export function verifyJwtToken(token: string): JwtPayload | null {
  try {
    const payload = jwt.verify(token, getJwtSecret());

    if (
      typeof payload === "object" &&
      typeof payload.sub === "string" &&
      typeof payload.email === "string" &&
      (payload.role === "user" || payload.role === "admin")
    ) {
      return {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function getJwtTokenFromRequest(request: Request) {
  const authorization = request.headers.get("authorization");

  if (authorization?.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }

  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`));

  return cookie ? decodeURIComponent(cookie.slice(AUTH_COOKIE_NAME.length + 1)) : null;
}

export async function getUserFromJwtToken(token: string): Promise<AuthUser | null> {
  const payload = verifyJwtToken(token);

  if (!payload) {
    return null;
  }

  const userId = Number(payload.sub);

  if (!Number.isInteger(userId)) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      email: true,
      name: true,
      role: true,
      pointsBalance: true,
      photoUrl: true,
    },
  });

  return user ?? null;
}

export function getUserFromRequest(request: Request) {
  const token = getJwtTokenFromRequest(request);

  return token ? getUserFromJwtToken(token) : Promise.resolve(null);
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    ...getAuthCookieOptions(),
    maxAge: 0,
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return getUserFromJwtToken(token);
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return user;
}

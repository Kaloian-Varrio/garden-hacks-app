import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

export type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export function jsonError(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export function validationError(details: Record<string, string>) {
  return NextResponse.json(
    {
      error: "Validation failed",
      details,
    },
    { status: 400 },
  );
}

export function getPagination(searchParams: URLSearchParams) {
  const rawPage = Number(searchParams.get("page"));
  const rawPageSize = Number(searchParams.get("pageSize"));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : DEFAULT_PAGE;
  const requestedPageSize =
    Number.isInteger(rawPageSize) && rawPageSize > 0
      ? rawPageSize
      : DEFAULT_PAGE_SIZE;
  const pageSize = Math.min(requestedPageSize, MAX_PAGE_SIZE);

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
  };
}

export async function parseIdParam(params: RouteContext["params"]) {
  const { id } = await params;
  const parsedId = Number(id);

  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

export function parsePositiveInteger(value: string | null) {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

export async function getOptionalApiUser(request: Request) {
  return getUserFromRequest(request);
}

export async function requireApiUser(request: Request) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return {
      user: null,
      response: jsonError("Unauthorized.", 401),
    };
  }

  return {
    user,
    response: null,
  };
}

export async function readJsonBody(request: Request) {
  return request.json().catch(() => null);
}


import type { DashboardHackFormValues } from "./types";

const difficulties = ["easy", "medium", "hard"] as const;
const statuses = ["draft", "published", "archived"] as const;

export function parseBoolean(value: unknown) {
  return value === true || value === "true" || value === "on";
}

export function optionalText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function requiredText(data: Record<string, unknown>, key: string) {
  const value = data[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

export function requiredPositiveInteger(data: Record<string, unknown>, key: string) {
  const value = Number(data[key]);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${key} is required.`);
  }

  return value;
}

export function parseHackPayload(data: unknown): DashboardHackFormValues {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid request body.");
  }

  const record = data as Record<string, unknown>;
  const difficulty = record.difficulty;
  const status = record.status;

  if (!difficulties.includes(difficulty as (typeof difficulties)[number])) {
    throw new Error("Difficulty is required.");
  }

  if (!statuses.includes(status as (typeof statuses)[number])) {
    throw new Error("Status is required.");
  }

  return {
    title: requiredText(record, "title"),
    excerpt: optionalText(record.excerpt),
    content: requiredText(record, "content"),
    imageUrl: optionalText(record.imageUrl),
    sourceUrl: optionalText(record.sourceUrl),
    groupId: requiredPositiveInteger(record, "groupId"),
    categoryId: requiredPositiveInteger(record, "categoryId"),
    difficulty: difficulty as DashboardHackFormValues["difficulty"],
    isOrganic: parseBoolean(record.isOrganic),
    isChemicalFree: parseBoolean(record.isChemicalFree),
    status: status as DashboardHackFormValues["status"],
  };
}

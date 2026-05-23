export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function readStringField(data: unknown, key: string) {
  if (!data || typeof data !== "object" || !(key in data)) {
    return "";
  }

  const value = (data as Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : "";
}

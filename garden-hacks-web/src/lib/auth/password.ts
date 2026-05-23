import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function comparePasswords(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

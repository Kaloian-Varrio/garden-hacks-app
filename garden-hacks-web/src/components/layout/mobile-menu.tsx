"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { navLinks } from "./nav-links";

export function MobileMenu({ user }: { user: { name: string } | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const visibleNavLinks = navLinks.filter((link) => user || !link.authRequired);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#cbd9c2] bg-white text-[#28472f]"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
        onClick={() => setIsOpen((value) => !value)}
      >
        <span className="text-xl leading-none">{isOpen ? "x" : "="}</span>
      </button>
      {isOpen ? (
        <div className="absolute left-4 right-4 top-16 z-50 rounded-lg border border-[#dfe8d8] bg-white p-3 shadow-lg">
          <nav className="grid gap-1" aria-label="Mobile navigation">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-semibold text-[#28472f] hover:bg-[#edf5e9]"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="mt-2 grid gap-2 border-t border-[#edf2e8] pt-3">
                <p className="truncate px-3 text-sm font-semibold text-[#59655c]">
                  Signed in as {user.name}
                </p>
                <Link
                  href="/dashboard"
                  className="rounded-md bg-[#2f6f3e] px-3 py-2 text-center text-sm font-semibold text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <LogoutButton className="w-full" />
              </div>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#edf2e8] pt-3">
                <Link
                  href="/login"
                  className="rounded-md border border-[#cbd9c2] px-3 py-2 text-center text-sm font-semibold text-[#28472f]"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-[#2f6f3e] px-3 py-2 text-center text-sm font-semibold text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      ) : null}
    </div>
  );
}

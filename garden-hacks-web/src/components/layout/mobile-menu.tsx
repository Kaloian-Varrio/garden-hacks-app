"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { SparkIcon } from "@/components/ui/garden-icons";
import { navLinks } from "./nav-links";

export function MobileMenu({ user }: { user: { name: string } | null }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="garden-focus inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#b7e7d1] bg-white/90 text-[#0f766e] shadow-sm"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
        onClick={() => setIsOpen((value) => !value)}
      >
        {isOpen ? (
          <span className="text-lg font-black leading-none">x</span>
        ) : (
          <span className="grid gap-1" aria-hidden="true">
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
          </span>
        )}
      </button>
      {isOpen ? (
        <div className="garden-card-glass absolute left-4 right-4 top-20 z-50 rounded-3xl p-4">
          <div className="mb-3 flex items-center gap-2 px-2 text-sm font-black text-[#0f766e]">
            <SparkIcon size={16} />
            Garden menu
          </div>
          <nav className="grid gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl px-3 py-2 text-sm font-bold text-[#28472f] transition hover:bg-[#dff8e9]"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="mt-2 grid gap-2 border-t border-[#d9eee4] pt-3">
                <p className="truncate px-3 text-sm font-semibold text-[#59655c]">
                  Signed in as {user.name}
                </p>
                <Link
                  href="/dashboard"
                  className="garden-btn garden-btn-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <LogoutButton className="w-full" />
              </div>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#d9eee4] pt-3">
                <Link
                  href="/login"
                  className="garden-btn garden-btn-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="garden-btn garden-btn-primary"
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

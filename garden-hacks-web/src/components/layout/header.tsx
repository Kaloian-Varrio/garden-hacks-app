import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import { BrandLogo } from "./brand-logo";
import { HeaderSearch } from "./header-search";
import { MobileMenu } from "./mobile-menu";
import { navLinks } from "./nav-links";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/78 shadow-sm shadow-emerald-900/5 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-h-14 items-center justify-between gap-3">
          <BrandLogo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="garden-focus rounded-full px-3 py-2 text-sm font-bold text-[#405046] transition hover:bg-[#dff8e9] hover:text-[#0d5f54] lg:px-4"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <HeaderSearch className="hidden min-w-48 max-w-72 flex-1 md:block lg:max-w-sm" />
          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <span className="max-w-32 truncate text-sm font-semibold text-[#405046] lg:max-w-36">
                {user.name}
              </span>
              <Button href="/dashboard" variant="ghost">
                Dashboard
              </Button>
              <LogoutButton />
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button href="/login" variant="ghost">
                Login
              </Button>
              <Button href="/register">Register</Button>
            </div>
          )}
          <MobileMenu user={user ? { name: user.name } : null} />
        </div>
        <HeaderSearch className="md:hidden" />
      </div>
    </header>
  );
}

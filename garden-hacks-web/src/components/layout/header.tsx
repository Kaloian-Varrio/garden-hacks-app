import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import { BrandLogo } from "./brand-logo";
import { MobileMenu } from "./mobile-menu";
import { navLinks } from "./nav-links";

export async function Header() {
  const user = await getCurrentUser();
  const visibleNavLinks = navLinks.filter((link) => user || !link.authRequired);

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/78 shadow-sm shadow-emerald-900/5 backdrop-blur-xl">
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandLogo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {visibleNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="garden-focus rounded-full px-4 py-2 text-sm font-bold text-[#405046] transition hover:bg-[#dff8e9] hover:text-[#0d5f54]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {user ? (
          <div className="hidden items-center gap-3 md:flex">
            <span className="max-w-36 truncate text-sm font-semibold text-[#405046]">
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
    </header>
  );
}

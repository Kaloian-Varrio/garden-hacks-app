import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import { MobileMenu } from "./mobile-menu";
import { navLinks } from "./nav-links";

export async function Header() {
  const user = await getCurrentUser();
  const visibleNavLinks = navLinks.filter((link) => user || !link.authRequired);

  return (
    <header className="sticky top-0 z-40 border-b border-[#dfe8d8] bg-[#f8faf7]/95 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#2f6f3e] text-lg font-black text-white">
            GH
          </span>
          <span className="text-base font-black text-[#18231c]">
            Garden Hacks
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {visibleNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-[#405046] transition hover:bg-[#edf5e9] hover:text-[#203525]"
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

import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { navLinks } from "./nav-links";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#10382f] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <div className="[&_span]:text-white [&_span_span:last-child]:text-[#5bd8d0]">
            <BrandLogo />
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#d8e6d1]">
            A community space for sustainable, organic, and regenerative growing
            ideas tested in real gardens, balconies, and backyards.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#5bd8d0]">Explore</p>
            <div className="mt-3 grid gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-[#edf5e9] transition hover:text-[#ffb35c]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#5bd8d0]">Community</p>
            <div className="mt-3 grid gap-2">
              <Link href="/login" className="text-sm font-semibold text-[#edf5e9] transition hover:text-[#ffb35c]">
                Login
              </Link>
              <Link href="/register" className="text-sm font-semibold text-[#edf5e9] transition hover:text-[#ffb35c]">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-[#c7d8bf]">
        Built for local development and learning with chemical-free gardening in
        mind.
      </div>
    </footer>
  );
}

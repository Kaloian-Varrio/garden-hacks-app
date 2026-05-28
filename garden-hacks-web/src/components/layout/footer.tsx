import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { navLinks } from "./nav-links";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#10382f] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.1fr_1.4fr] lg:px-8">
        <div>
          <div className="[&_span]:text-white [&_span_span:last-child]:text-[#5bd8d0]">
            <BrandLogo />
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#d8e6d1]">
            A community space for sustainable, organic, and regenerative growing
            ideas tested in real gardens, balconies, and backyards.
          </p>
          <div className="mt-5 grid gap-2 text-sm text-[#d8e6d1]">
            <p className="font-black uppercase tracking-[0.14em] text-[#5bd8d0]">
              Contact
            </p>
            <a
              href="mailto:info@gardenhacks.com"
              className="font-semibold transition hover:text-[#ffb35c]"
            >
              info@gardenhacks.com
            </a>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Facebook", "YouTube", "Instagram"].map((social) => (
                <span
                  key={social}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-[#edf5e9]"
                >
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
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
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#5bd8d0]">Partners</p>
            <a
              href="https://varriosport.bg/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 text-sm font-semibold text-[#edf5e9] transition hover:border-[#ffb35c]/60 hover:text-[#ffb35c]"
            >
              {/* TODO: Replace placeholder with the approved official Varrio Sport logo asset when available. */}
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-black text-[#10382f]">
                VS
              </span>
              Powered by Varrio Sport
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-[#c7d8bf]">
        <p>
          All rights reserved. Garden Hacks and its content belong to Varrio
          Sport Ltd.
        </p>
        <p className="mt-1">
        Built for local development and learning with chemical-free gardening in
        mind.
        </p>
      </div>
    </footer>
  );
}

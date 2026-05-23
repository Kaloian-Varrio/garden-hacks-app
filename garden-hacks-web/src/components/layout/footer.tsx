import Link from "next/link";
import { navLinks } from "./nav-links";

export function Footer() {
  return (
    <footer className="border-t border-[#dfe8d8] bg-[#203525] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <p className="text-lg font-black">Garden Hacks App</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#d8e6d1]">
            A community space for sustainable, organic, and regenerative growing
            ideas tested in real gardens, balconies, and backyards.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm font-bold text-[#a9d49b]">Explore</p>
            <div className="mt-3 grid gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#edf5e9] hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-[#a9d49b]">Community</p>
            <div className="mt-3 grid gap-2">
              <Link href="/login" className="text-sm text-[#edf5e9]">
                Login
              </Link>
              <Link href="/register" className="text-sm text-[#edf5e9]">
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

import Link from "next/link";

type BrandLogoProps = {
  className?: string;
  compact?: boolean;
};

export function BrandLogo({ className = "", compact = false }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={`garden-focus group inline-flex items-center gap-3 rounded-2xl ${className}`}
      aria-label="Garden Hacks home"
    >
      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] transition duration-200 group-hover:-translate-y-0.5">
        <GardenHacksMark className="h-full w-full" />
      </span>
      {!compact ? (
        <span className="grid leading-none">
          <span className="text-xl font-black text-[#10231c]">
            Garden Hacks
          </span>
          <span className="mt-1 text-[11px] font-black uppercase garden-gradient-text tracking-[0.14em]">
            grow smarter
          </span>
        </span>
      ) : null}
    </Link>
  );
}

function GardenHacksMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bgG" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E9F7EF" />
          <stop offset="1" stopColor="#CDE7D3" />
        </linearGradient>

        <radialGradient id="tomBody" cx="38" cy="42" r="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B6B" />
          <stop offset="0.5" stopColor="#EE3131" />
          <stop offset="1" stopColor="#A81515" />
        </radialGradient>

        <linearGradient id="leafFront" x1="48" y1="36" x2="72" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6EE7B7" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>

        <linearGradient id="leafLeft" x1="48" y1="32" x2="20" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
      </defs>

      {/* App Icon Base */}
      <rect width="96" height="96" rx="22" fill="url(#bgG)" />

      {/* Soft Shadow under tomato */}
      <ellipse cx="48" cy="82" rx="28" ry="5" fill="#A3C2A9" opacity="0.8" />

      {/* Main Tomato */}
      <circle cx="48" cy="56" r="28" fill="url(#tomBody)" />

      {/* Glossy Highlights */}
      <ellipse cx="36" cy="42" rx="7" ry="14" transform="rotate(-35 36 42)" fill="#FFFFFF" opacity="0.4" />
      <path d="M 68 72 C 60 80, 36 80, 30 72 C 40 76, 58 76, 68 72" fill="#FFC9C9" opacity="0.25" />

      {/* Back little leaf */}
      <path d="M 48 32 C 40 18, 56 18, 48 32 Z" fill="#6EE7B7" />

      {/* Left bright leaf */}
      <path d="M 48 32 C 30 20, 16 34, 24 44 C 32 38, 44 36, 48 32 Z" fill="url(#leafLeft)" />

      {/* Right prominent leaf */}
      <path d="M 48 32 C 72 16, 84 28, 76 44 C 64 36, 52 36, 48 32 Z" fill="url(#leafFront)" />

      {/* Leaf veins */}
      <path d="M 48 32 Q 38 28 26 34" stroke="#064E3B" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" fill="none" />
      <path d="M 48 32 Q 62 26 72 32" stroke="#064E3B" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" fill="none" />

      {/* Stem Star / Sepal center */}
      <path d="M 48 28 L 44 34 L 48 36 L 52 34 Z" fill="#047857" />

      {/* Curly green stem */}
      <path d="M 48 30 Q 52 14 62 10" stroke="#059669" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}


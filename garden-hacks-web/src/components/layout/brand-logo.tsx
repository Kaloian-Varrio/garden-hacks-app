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
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.15rem] bg-white shadow-lg shadow-emerald-900/15 ring-1 ring-[#b7e7d1] transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-xl">
        <GardenHacksMark className="h-9 w-9" />
      </span>
      {!compact ? (
        <span className="grid leading-none">
          <span className="text-lg font-black tracking-tight text-[#10231c]">
            Garden Hacks
          </span>
          <span className="mt-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#0f766e]">
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
      fill="none"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22" fill="url(#garden-mark-bg)" />
      <path
        d="M24 34V21"
        stroke="#0f766e"
        strokeLinecap="round"
        strokeWidth="3.2"
      />
      <path
        d="M23.4 22.8c-6.8-.4-11-4.9-11.8-11.6 6.8.4 11.2 4.7 11.8 11.6Z"
        fill="#3dbb74"
      />
      <path
        d="M25.1 22.5c6.7-.9 10.8-5.7 11-12.5-6.7.9-10.9 5.5-11 12.5Z"
        fill="#5bd8d0"
      />
      <circle cx="24" cy="35" r="6.8" fill="#f0643c" />
      <path
        d="m24 28.2 1.7-4.1M24 28.2l-1.7-4.1M24 28.2l4-1.4M24 28.2l-4-1.4"
        stroke="#176b49"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="m36.5 27 1 2.7 2.7 1-2.7 1-1 2.7-1-2.7-2.7-1 2.7-1 1-2.7Z"
        fill="#ffb35c"
      />
      <defs>
        <linearGradient
          id="garden-mark-bg"
          x1="7"
          x2="41"
          y1="5"
          y2="43"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e9fbff" />
          <stop offset=".52" stopColor="#dff8e9" />
          <stop offset="1" stopColor="#fff0d8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

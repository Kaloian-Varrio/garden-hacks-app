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
          <span className="mt-1 text-[11px] font-black uppercase text-[#0f766e]">
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
      viewBox="0 0 96 96"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="96" height="96" rx="24" fill="#087f7d" />
      <path
        d="M48 81C45.7 68 46.8 57.6 49 48"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="6.2"
      />
      <path
        d="M48.2 47.5C39.8 36 41.4 24.2 48.4 14.8C55.6 24.5 56.6 36.5 48.2 47.5Z"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6.2"
      />
      <path
        d="M46.8 48.1C34.9 45.7 27.6 37.7 28.6 27.4C39 27 46.2 35 46.8 48.1Z"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6.2"
      />
      <path
        d="M49.2 48.1C61.1 45.7 68.4 37.7 67.4 27.4C57 27 49.8 35 49.2 48.1Z"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6.2"
      />
      <path
        d="M33.8 67.2C41.4 64.6 46.7 57.4 48 48.6C51 57 57.2 64.1 64.7 67.2"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6.2"
      />
    </svg>
  );
}

import Link from "next/link";
import { SparkIcon, SproutIcon } from "@/components/ui/garden-icons";

export function BrandLogo() {
  return (
    <Link href="/" className="group flex items-center gap-3 garden-focus rounded-2xl">
      <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5bd8d0] via-[#38a15f] to-[#176b49] text-white shadow-lg shadow-emerald-900/15 transition group-hover:scale-105">
        <SproutIcon size={25} />
        <span className="absolute -right-1 -top-1 rounded-full bg-[#ffb35c] p-1 text-[#7a2d17] shadow-sm">
          <SparkIcon size={12} />
        </span>
      </span>
      <span className="grid leading-none">
        <span className="text-lg font-black tracking-tight text-[#10231c]">
          Garden Hacks
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0f766e]">
          grow smarter
        </span>
      </span>
    </Link>
  );
}

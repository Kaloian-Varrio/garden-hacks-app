import { LightbulbIcon, SparkIcon } from "@/components/ui/garden-icons";

type HackVisualProps = {
  category?: string | null;
  className?: string;
  imageUrl?: string | null;
  title: string;
};

const visualStyles = {
  balcony: {
    badge: "Balcony garden",
    colors: "from-[#dff8e9] via-[#dff7ff] to-[#fff0d8]",
    symbol: "Pots",
  },
  compost: {
    badge: "Healthy soil",
    colors: "from-[#f5ead8] via-[#dff8e9] to-[#b7e7d1]",
    symbol: "Soil",
  },
  cucumber: {
    badge: "Cucumber care",
    colors: "from-[#e9fbef] via-[#c9f7d6] to-[#e9fbff]",
    symbol: "Vines",
  },
  garden: {
    badge: "Clever hack",
    colors: "from-[#dff8e9] via-[#c7f4ee] to-[#fff0d8]",
    symbol: "Grow",
  },
  greenhouse: {
    badge: "Greenhouse",
    colors: "from-[#e9fbff] via-[#dff8e9] to-[#c7f4ee]",
    symbol: "Glass",
  },
  herbs: {
    badge: "Herb garden",
    colors: "from-[#e9fbef] via-[#dff8e9] to-[#fff7df]",
    symbol: "Herbs",
  },
  pests: {
    badge: "Plant protection",
    colors: "from-[#fff7df] via-[#e9fbef] to-[#dff7ff]",
    symbol: "Shield",
  },
  seeds: {
    badge: "Seeds & sprouts",
    colors: "from-[#fff0d8] via-[#e9fbef] to-[#dff8e9]",
    symbol: "Seeds",
  },
  tomato: {
    badge: "Tomato garden",
    colors: "from-[#fff0eb] via-[#fff7df] to-[#dff8e9]",
    symbol: "Tomato",
  },
  watering: {
    badge: "Water wise",
    colors: "from-[#dff7ff] via-[#e9fbff] to-[#dff8e9]",
    symbol: "Water",
  },
} as const;

type VisualKey = keyof typeof visualStyles;

export function HackVisual({
  category,
  className = "",
  imageUrl,
  title,
}: HackVisualProps) {
  const visual = visualStyles[getHackVisualKey({ category, title })];

  return (
    <div
      className={`garden-image-shell group relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${visual.colors} ${className}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <FallbackIllustration symbol={visual.symbol} title={title} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#10231c]/35 via-transparent to-white/5" />
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#0f766e] shadow-lg backdrop-blur">
        <LightbulbIcon size={16} />
        {visual.badge}
      </div>
    </div>
  );
}

function FallbackIllustration({
  symbol,
  title,
}: {
  symbol: string;
  title: string;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-[#fff7bf]/80" />
      <div className="absolute bottom-0 right-10 h-40 w-5 rotate-[24deg] rounded-full bg-[#176b49]/80" />
      <div className="absolute right-10 top-12 h-20 w-32 -rotate-12 rounded-[70%_0_70%_0] bg-[#5bd8d0]/80" />
      <div className="absolute bottom-16 left-10 h-16 w-28 rotate-12 rounded-[0_70%_0_70%] bg-[#38a15f]/80" />
      <div className="relative grid h-28 w-28 place-items-center rounded-[2rem] border border-white/70 bg-white/55 text-center shadow-2xl backdrop-blur">
        <SparkIcon className="absolute right-3 top-3 text-[#f0643c]" size={18} />
        <span className="px-3 text-xl font-black leading-6 text-[#176b49]">
          {symbol}
        </span>
      </div>
      <span className="sr-only">{title}</span>
    </div>
  );
}

function getHackVisualKey({
  category,
  title,
}: {
  category?: string | null;
  title: string;
}): VisualKey {
  const haystack = `${title} ${category ?? ""}`.toLowerCase();

  if (matches(haystack, ["tomato", "tomatoes"])) return "tomato";
  if (matches(haystack, ["cucumber", "cucumbers"])) return "cucumber";
  if (matches(haystack, ["compost", "soil", "mulch", "leaf mold"])) return "compost";
  if (matches(haystack, ["water", "watering", "irrigation", "droplet"])) return "watering";
  if (matches(haystack, ["pest", "bug", "aphid", "slug", "protect"])) return "pests";
  if (matches(haystack, ["balcony", "container", "pot", "pots"])) return "balcony";
  if (matches(haystack, ["seed", "sprout", "seedling"])) return "seeds";
  if (matches(haystack, ["herb", "basil", "mint", "parsley"])) return "herbs";
  if (matches(haystack, ["greenhouse", "cold frame"])) return "greenhouse";

  return "garden";
}

function matches(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

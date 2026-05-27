const GROUP_IMAGE_BY_SLUG: Record<string, string> = {
  "balcony-gardening": "/images/groups/balcony-gardening.jpg",
  "composting-masters": "/images/groups/composting-masters.jpg",
  "herbs-and-medicinal-plants": "/images/groups/herbs-and-medicinal-plants.jpg",
  "natural-pest-control": "/images/groups/natural-pest-control.jpg",
  "organic-vegetables": "/images/groups/organic-vegetables.jpg",
  "seasonal-garden-planning": "/images/groups/seasonal-garden-planning.jpg",
  "soil-regeneration": "/images/groups/soil-regeneration.jpg",
  "water-saving-garden": "/images/groups/water-saving-garden.jpg",
};

const HACK_IMAGE_BY_SLUG: Record<string, string> = {
  "autumn-bed-reset-for-earlier-spring-planting":
    "/images/hacks/autumn-bed-reset-for-earlier-spring-planting.jpg",
  "buried-clay-pot-drip-watering-for-dry-weeks":
    "/images/hacks/buried-clay-pot-drip-watering-for-dry-weeks.jpg",
  "deep-pot-balcony-tomatoes-with-steady-moisture":
    "/images/hacks/deep-pot-balcony-tomatoes-with-steady-moisture.jpg",
  "gentle-aphid-rinse-for-young-pepper-plants":
    "/images/hacks/gentle-aphid-rinse-for-young-pepper-plants.jpg",
  "heatwave-shade-and-mulch-plan-for-young-seedlings":
    "/images/hacks/heatwave-shade-and-mulch-plan-for-young-seedlings.jpg",
  "herb-flower-pest-patrol-for-cabbage-beds":
    "/images/hacks/herb-flower-pest-patrol-for-cabbage-beds.jpg",
  "kitchen-waste-fermented-feed-for-hungry-tomatoes":
    "/images/hacks/kitchen-waste-fermented-feed-for-hungry-tomatoes.jpg",
  "leaf-mold-soil-sponge-for-tired-beds":
    "/images/hacks/leaf-mold-soil-sponge-for-tired-beds.jpg",
  "marigold-and-basil-border-for-vegetable-beds":
    "/images/hacks/marigold-and-basil-border-for-vegetable-beds.jpg",
  "no-dig-worm-friendly-bed-refresh":
    "/images/hacks/no-dig-worm-friendly-bed-refresh.jpg",
  "small-garden-compost-pail-that-does-not-smell":
    "/images/hacks/small-garden-compost-pail-that-does-not-smell.jpg",
  "windowsill-herb-trio-that-handles-frequent-cutting":
    "/images/hacks/windowsill-herb-trio-that-handles-frequent-cutting.jpg",
};

export function getGroupImageUrl({
  imageUrl,
  slug,
}: {
  imageUrl?: string | null;
  slug: string;
}) {
  const themedImage = GROUP_IMAGE_BY_SLUG[slug];

  if (themedImage && isReplaceableImage(imageUrl)) {
    return themedImage;
  }

  return imageUrl ?? themedImage ?? "/images/groups/organic-vegetables.jpg";
}

export function getHackImageUrl({
  imageUrl,
  slug,
}: {
  imageUrl?: string | null;
  slug: string;
}) {
  const themedImage = HACK_IMAGE_BY_SLUG[slug];

  if (themedImage && isReplaceableImage(imageUrl)) {
    return themedImage;
  }

  return imageUrl ?? themedImage ?? "/images/hacks/small-garden-compost-pail-that-does-not-smell.jpg";
}

function isReplaceableImage(imageUrl?: string | null) {
  return !imageUrl || imageUrl.includes("placehold.co");
}

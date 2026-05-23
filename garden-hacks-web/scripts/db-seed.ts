import "dotenv/config";

import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import {
  categories,
  db,
  gardeningHacks,
  groupMembers,
  groups,
  hackComments,
  hackLikes,
  hackVotes,
  savedHacks,
  userPointsLog,
  users,
} from "../src/db";

const YOUTUBE_INSPIRATION_URL =
  "https://www.youtube.com/@%D0%93%D1%80%D0%B0%D0%B4%D0%B8%D0%BD%D0%B0%D1%82%D0%B0%D0%BD%D0%B0%D0%94%D1%8F%D0%B4%D0%BE%D0%98%D0%B2%D0%B0%D0%BD";

const PASSWORD = "pass1234";
const REGULAR_PASSWORD = "garden1234";
const PUBLISHED_HACK_POINTS = 10;

const imageUrl = (label: string) =>
  `https://placehold.co/1200x800/e8f5dc/31572c/png?text=${encodeURIComponent(
    label,
  )}`;

const seedUsers = [
  {
    email: "kaloianh@gmail.com",
    name: "Kaloian Admin",
    role: "admin" as const,
    bio: "Garden Hacks administrator focused on practical, chemical-free growing.",
    photoUrl: imageUrl("Kaloian Admin"),
  },
  {
    email: "sofia.raykova@example.com",
    name: "Sofia Raykova",
    role: "user" as const,
    bio: "No-dig vegetable grower testing resilient soil routines in raised beds.",
    photoUrl: imageUrl("Sofia Raykova"),
  },
  {
    email: "georgi.petrov@example.com",
    name: "Georgi Petrov",
    role: "user" as const,
    bio: "Compost maker who turns kitchen scraps and leaves into dark garden humus.",
    photoUrl: imageUrl("Georgi Petrov"),
  },
  {
    email: "mila.stoyanova@example.com",
    name: "Mila Stoyanova",
    role: "user" as const,
    bio: "Balcony gardener growing tomatoes, herbs, and flowers in a sunny apartment.",
    photoUrl: imageUrl("Mila Stoyanova"),
  },
  {
    email: "nikolay.ivanov@example.com",
    name: "Nikolay Ivanov",
    role: "user" as const,
    bio: "Experiments with companion planting and natural pest protection.",
    photoUrl: imageUrl("Nikolay Ivanov"),
  },
  {
    email: "elena.markova@example.com",
    name: "Elena Markova",
    role: "user" as const,
    bio: "Herb grower preserving traditional kitchen and medicinal garden knowledge.",
    photoUrl: imageUrl("Elena Markova"),
  },
  {
    email: "petar.dimitrov@example.com",
    name: "Petar Dimitrov",
    role: "user" as const,
    bio: "Water-wise gardener building simple irrigation systems from reused materials.",
    photoUrl: imageUrl("Petar Dimitrov"),
  },
  {
    email: "irina.koleva@example.com",
    name: "Irina Koleva",
    role: "user" as const,
    bio: "Seasonal planner who loves orderly beds, seedlings, and steady harvests.",
    photoUrl: imageUrl("Irina Koleva"),
  },
  {
    email: "vasil.todorov@example.com",
    name: "Vasil Todorov",
    role: "user" as const,
    bio: "Backyard gardener rebuilding tired soil with mulch, compost, and patience.",
    photoUrl: imageUrl("Vasil Todorov"),
  },
];

const seedGroups = [
  {
    title: "Organic Vegetables",
    slug: "organic-vegetables",
    description:
      "Practical ideas for growing healthy vegetables without synthetic fertilizers or pesticides.",
  },
  {
    title: "Balcony Gardening",
    slug: "balcony-gardening",
    description:
      "Small-space growing for balconies, windowsills, patios, and compact containers.",
  },
  {
    title: "Composting Masters",
    slug: "composting-masters",
    description:
      "Compost recipes, leaf mold, worm-friendly systems, and soil food web habits.",
  },
  {
    title: "Natural Pest Control",
    slug: "natural-pest-control",
    description:
      "Gentle prevention methods that protect crops while keeping the garden alive.",
  },
  {
    title: "Soil Regeneration",
    slug: "soil-regeneration",
    description:
      "No-dig methods, mulch systems, cover crops, and organic matter strategies.",
  },
  {
    title: "Herbs and Medicinal Plants",
    slug: "herbs-and-medicinal-plants",
    description:
      "Growing useful herbs for the kitchen, teas, pollinators, and home remedies.",
  },
  {
    title: "Water Saving Garden",
    slug: "water-saving-garden",
    description:
      "Low-water growing, moisture retention, drip ideas, and heat protection.",
  },
  {
    title: "Seasonal Garden Planning",
    slug: "seasonal-garden-planning",
    description:
      "Monthly garden planning, bed preparation, crop rotation, and timely planting.",
  },
];

const seedCategories = [
  {
    title: "Soil Regeneration",
    slug: "soil-regeneration",
    description: "Methods that rebuild structure, fertility, and living soil.",
  },
  {
    title: "Organic Vegetables",
    slug: "organic-vegetables",
    description: "Chemical-free vegetable growing from seedling to harvest.",
  },
  {
    title: "Composting",
    slug: "composting",
    description: "Compost piles, bins, leaf mold, and kitchen waste fertilizer.",
  },
  {
    title: "Natural Pest Control",
    slug: "natural-pest-control",
    description: "Plant-safe pest prevention using observation and biodiversity.",
  },
  {
    title: "Balcony Gardening",
    slug: "balcony-gardening",
    description: "Container growing and edible gardens in small urban spaces.",
  },
  {
    title: "Herbs and Medicinal Plants",
    slug: "herbs-and-medicinal-plants",
    description: "Growing herbs for cooking, pollinators, teas, and simple remedies.",
  },
  {
    title: "Water Saving",
    slug: "water-saving",
    description: "Irrigation, mulch, shade, and watering methods that reduce waste.",
  },
  {
    title: "Seasonal Gardening",
    slug: "seasonal-gardening",
    description: "Seasonal preparation, rotations, timing, and garden calendars.",
  },
];

const membershipsByGroup: Record<
  string,
  Array<{ email: string; groupRole: "member" | "manager" }>
> = {
  "organic-vegetables": [
    { email: "sofia.raykova@example.com", groupRole: "manager" },
    { email: "nikolay.ivanov@example.com", groupRole: "member" },
    { email: "irina.koleva@example.com", groupRole: "member" },
    { email: "vasil.todorov@example.com", groupRole: "member" },
  ],
  "balcony-gardening": [
    { email: "mila.stoyanova@example.com", groupRole: "manager" },
    { email: "elena.markova@example.com", groupRole: "member" },
    { email: "petar.dimitrov@example.com", groupRole: "member" },
    { email: "irina.koleva@example.com", groupRole: "member" },
  ],
  "composting-masters": [
    { email: "georgi.petrov@example.com", groupRole: "manager" },
    { email: "sofia.raykova@example.com", groupRole: "member" },
    { email: "vasil.todorov@example.com", groupRole: "member" },
    { email: "kaloianh@gmail.com", groupRole: "member" },
  ],
  "natural-pest-control": [
    { email: "nikolay.ivanov@example.com", groupRole: "manager" },
    { email: "sofia.raykova@example.com", groupRole: "member" },
    { email: "elena.markova@example.com", groupRole: "member" },
    { email: "mila.stoyanova@example.com", groupRole: "member" },
  ],
  "soil-regeneration": [
    { email: "vasil.todorov@example.com", groupRole: "manager" },
    { email: "georgi.petrov@example.com", groupRole: "member" },
    { email: "sofia.raykova@example.com", groupRole: "member" },
    { email: "petar.dimitrov@example.com", groupRole: "member" },
  ],
  "herbs-and-medicinal-plants": [
    { email: "elena.markova@example.com", groupRole: "manager" },
    { email: "mila.stoyanova@example.com", groupRole: "member" },
    { email: "irina.koleva@example.com", groupRole: "member" },
    { email: "nikolay.ivanov@example.com", groupRole: "member" },
  ],
  "water-saving-garden": [
    { email: "petar.dimitrov@example.com", groupRole: "manager" },
    { email: "mila.stoyanova@example.com", groupRole: "member" },
    { email: "vasil.todorov@example.com", groupRole: "member" },
    { email: "kaloianh@gmail.com", groupRole: "member" },
  ],
  "seasonal-garden-planning": [
    { email: "irina.koleva@example.com", groupRole: "manager" },
    { email: "sofia.raykova@example.com", groupRole: "member" },
    { email: "georgi.petrov@example.com", groupRole: "member" },
    { email: "elena.markova@example.com", groupRole: "member" },
  ],
};

const hackSeeds = [
  {
    key: "small-garden-compost-pail",
    title: "Small Garden Compost Pail That Does Not Smell",
    slug: "small-garden-compost-pail-that-does-not-smell",
    groupSlug: "composting-masters",
    categorySlug: "composting",
    authorEmail: "georgi.petrov@example.com",
    difficulty: "easy" as const,
    excerpt:
      "A layered kitchen-scrap pail routine that stays balanced until it is ready for the outdoor heap.",
    content:
      "Line a lidded pail with dry shredded cardboard, add chopped vegetable scraps in thin layers, and cover each fresh layer with a handful of dry leaves or finished compost. Empty it twice a week into the main pile and rinse with diluted vinegar when needed. The dry carbon layer keeps fruit flies down and gives the pile a better start.",
  },
  {
    key: "balcony-tomato-deep-pot",
    title: "Deep-Pot Balcony Tomatoes With Steady Moisture",
    slug: "deep-pot-balcony-tomatoes-with-steady-moisture",
    groupSlug: "balcony-gardening",
    categorySlug: "balcony-gardening",
    authorEmail: "mila.stoyanova@example.com",
    difficulty: "medium" as const,
    excerpt:
      "A container setup for tomatoes that reduces drying stress on hot balconies.",
    content:
      "Use a deep container with drainage, bury the tomato stem lower than usual, and add a compost-rich mix under a straw mulch cap. Water slowly in the morning until the lower soil is damp, then check again in the evening during heat waves. A simple saucer reservoir helps, but empty standing water after an hour to protect the roots.",
  },
  {
    key: "marigold-basil-vegetable-border",
    title: "Marigold and Basil Border for Vegetable Beds",
    slug: "marigold-and-basil-border-for-vegetable-beds",
    groupSlug: "organic-vegetables",
    categorySlug: "organic-vegetables",
    authorEmail: "sofia.raykova@example.com",
    difficulty: "easy" as const,
    excerpt:
      "A companion planting border that attracts pollinators and makes pest scouting easier.",
    content:
      "Plant marigolds and basil in a loose border around peppers, tomatoes, and eggplants. Keep the border airy so you can still inspect stems and leaf undersides. The flowers bring beneficial insects close to the crop, while the basil fills gaps and gives you a useful harvest before the vegetables peak.",
  },
  {
    key: "soft-soap-aphid-rinse",
    title: "Gentle Aphid Rinse for Young Pepper Plants",
    slug: "gentle-aphid-rinse-for-young-pepper-plants",
    groupSlug: "natural-pest-control",
    categorySlug: "natural-pest-control",
    authorEmail: "nikolay.ivanov@example.com",
    difficulty: "easy" as const,
    excerpt:
      "A mild, plant-first response for early aphid clusters before they spread.",
    content:
      "Start with a firm water spray under the leaves, then wipe stubborn clusters with a very diluted unscented soap solution. Rinse the plant after ten minutes and repeat only if new clusters return. Pair this with nearby flowering herbs so helpful insects have a reason to stay.",
  },
  {
    key: "leaf-mold-soil-sponge",
    title: "Leaf Mold Soil Sponge for Tired Beds",
    slug: "leaf-mold-soil-sponge-for-tired-beds",
    groupSlug: "soil-regeneration",
    categorySlug: "soil-regeneration",
    authorEmail: "vasil.todorov@example.com",
    difficulty: "medium" as const,
    excerpt:
      "Use aged leaves to improve water holding and soil texture without synthetic additives.",
    content:
      "Collect fallen leaves, moisten them, and pack them into a breathable sack or simple wire ring. After several months, crumble the dark material over beds before mulching. Leaf mold feeds soil life gently, improves moisture retention, and is especially useful in beds that crust after watering.",
  },
  {
    key: "windowsill-herb-trio",
    title: "Windowsill Herb Trio That Handles Frequent Cutting",
    slug: "windowsill-herb-trio-that-handles-frequent-cutting",
    groupSlug: "herbs-and-medicinal-plants",
    categorySlug: "herbs-and-medicinal-plants",
    authorEmail: "elena.markova@example.com",
    difficulty: "easy" as const,
    excerpt:
      "A compact basil, parsley, and mint routine for steady harvests in small spaces.",
    content:
      "Grow basil, parsley, and mint in separate pots so mint cannot take over. Pinch basil above leaf pairs, cut parsley from the outside, and trim mint often to keep it bushy. Rotate the pots every few days and water when the top finger-width of soil feels dry.",
  },
  {
    key: "clay-pot-drip-watering",
    title: "Buried Clay Pot Drip Watering for Dry Weeks",
    slug: "buried-clay-pot-drip-watering-for-dry-weeks",
    groupSlug: "water-saving-garden",
    categorySlug: "water-saving",
    authorEmail: "petar.dimitrov@example.com",
    difficulty: "medium" as const,
    excerpt:
      "A low-tech irrigation method that releases moisture near roots instead of over leaves.",
    content:
      "Bury an unglazed clay pot between thirsty crops, leaving the neck above soil level. Fill it with water and cover the opening with a small tile or saucer. The clay releases moisture slowly into the surrounding soil, reducing surface evaporation and keeping foliage dry.",
  },
  {
    key: "autumn-bed-reset",
    title: "Autumn Bed Reset for Earlier Spring Planting",
    slug: "autumn-bed-reset-for-earlier-spring-planting",
    groupSlug: "seasonal-garden-planning",
    categorySlug: "seasonal-gardening",
    authorEmail: "irina.koleva@example.com",
    difficulty: "easy" as const,
    excerpt:
      "A simple end-of-season routine that leaves beds protected and ready to wake up.",
    content:
      "Remove diseased crop remains, chop healthy stems in place, and add a thin compost layer before covering the soil with leaves or straw. Mark where heavy feeders grew so spring rotation is easier. Protected beds warm more evenly and need less emergency work when planting season starts.",
  },
  {
    key: "kitchen-waste-fermented-feed",
    title: "Kitchen Waste Fermented Feed for Hungry Tomatoes",
    slug: "kitchen-waste-fermented-feed-for-hungry-tomatoes",
    groupSlug: "organic-vegetables",
    categorySlug: "composting",
    authorEmail: "sofia.raykova@example.com",
    difficulty: "hard" as const,
    excerpt:
      "A cautious way to turn small amounts of kitchen waste into a diluted plant feed.",
    content:
      "Ferment chopped vegetable peels with a little molasses in a sealed bucket for two weeks, then strain and dilute heavily before using around established plants. Apply to moist soil, never to dry roots, and stop if the smell turns rotten instead of pleasantly sour. The solids belong in the compost pile.",
  },
  {
    key: "heatwave-shade-mulch",
    title: "Heatwave Shade and Mulch Plan for Young Seedlings",
    slug: "heatwave-shade-and-mulch-plan-for-young-seedlings",
    groupSlug: "water-saving-garden",
    categorySlug: "water-saving",
    authorEmail: "petar.dimitrov@example.com",
    difficulty: "easy" as const,
    excerpt:
      "A fast setup to help seedlings survive sudden hot weather without overwatering.",
    content:
      "Water deeply before the hottest part of the day, add a loose mulch ring that does not touch the stem, and hang light shade cloth on the afternoon side. Remove shade once temperatures settle so plants do not stretch. This keeps roots cooler while still allowing airflow.",
  },
  {
    key: "no-dig-worm-bed",
    title: "No-Dig Worm-Friendly Bed Refresh",
    slug: "no-dig-worm-friendly-bed-refresh",
    groupSlug: "soil-regeneration",
    categorySlug: "soil-regeneration",
    authorEmail: "vasil.todorov@example.com",
    difficulty: "medium" as const,
    excerpt:
      "Refresh a compacted bed by feeding soil life from the top instead of turning it over.",
    content:
      "Loosen only the planting holes, then spread compost, damp cardboard strips, and straw over the surface. Keep the bed moist for two weeks before planting through the mulch. Worms and microbes pull the organic matter downward, improving structure without breaking soil layers apart.",
  },
  {
    key: "herb-flower-pest-patrol",
    title: "Herb Flower Pest Patrol for Cabbage Beds",
    slug: "herb-flower-pest-patrol-for-cabbage-beds",
    groupSlug: "natural-pest-control",
    categorySlug: "natural-pest-control",
    authorEmail: "nikolay.ivanov@example.com",
    difficulty: "medium" as const,
    excerpt:
      "Use flowering herbs as early warning stations and habitat near brassicas.",
    content:
      "Let dill, coriander, and thyme flower near cabbage beds in small patches. Check those flowers during morning rounds because beneficial insects often gather there first. Combine the habitat with regular leaf checks and hand removal of eggs before caterpillars become a real problem.",
  },
];

const commentTemplates = [
  "I tried a similar approach last season and the steady moisture made a visible difference.",
  "This is practical enough for a weekend test. I would add a note to check drainage after heavy rain.",
  "Great reminder to observe the plants first instead of rushing into stronger treatments.",
  "The timing tip is useful. I usually miss this window and end up doing twice the work later.",
  "I like that this keeps the soil covered and feeds it slowly. That has worked well in my beds too.",
  "This would fit nicely in a small garden because it does not need special equipment.",
  "The caution about dilution is important. Gentle methods still need careful use.",
  "I am saving this for the next planting round. It matches what I have seen with healthier roots.",
];

const savedHackSeeds = [
  ["small-garden-compost-pail", "mila.stoyanova@example.com"],
  ["small-garden-compost-pail", "vasil.todorov@example.com"],
  ["balcony-tomato-deep-pot", "petar.dimitrov@example.com"],
  ["marigold-basil-vegetable-border", "elena.markova@example.com"],
  ["soft-soap-aphid-rinse", "sofia.raykova@example.com"],
  ["leaf-mold-soil-sponge", "georgi.petrov@example.com"],
  ["windowsill-herb-trio", "irina.koleva@example.com"],
  ["clay-pot-drip-watering", "mila.stoyanova@example.com"],
  ["autumn-bed-reset", "sofia.raykova@example.com"],
  ["kitchen-waste-fermented-feed", "georgi.petrov@example.com"],
  ["heatwave-shade-mulch", "vasil.todorov@example.com"],
  ["no-dig-worm-bed", "petar.dimitrov@example.com"],
  ["herb-flower-pest-patrol", "elena.markova@example.com"],
];

const clearDatabase = async () => {
  await db.delete(savedHacks);
  await db.delete(hackVotes);
  await db.delete(hackLikes);
  await db.delete(hackComments);
  await db.delete(userPointsLog);
  await db.delete(gardeningHacks);
  await db.delete(groupMembers);
  await db.delete(groups);
  await db.delete(categories);
  await db.delete(users);
};

const toMap = <T extends { id: number }, K extends string | number>(
  records: T[],
  getKey: (record: T) => K,
) => new Map(records.map((record) => [getKey(record), record]));

const requireRecord = <T>(map: Map<string, T>, key: string, label: string) => {
  const record = map.get(key);

  if (!record) {
    throw new Error(`Missing ${label}: ${key}`);
  }

  return record;
};

const runSeed = async () => {
  console.log("Clearing existing Garden Hacks development data...");
  await clearDatabase();

  const adminPasswordHash = await bcrypt.hash(PASSWORD, 12);
  const regularPasswordHash = await bcrypt.hash(REGULAR_PASSWORD, 12);

  const insertedUsers = await db
    .insert(users)
    .values(
      seedUsers.map((user) => ({
        ...user,
        passwordHash:
          user.email === "kaloianh@gmail.com"
            ? adminPasswordHash
            : regularPasswordHash,
        pointsBalance: 0,
      })),
    )
    .returning();
  const usersByEmail = toMap(insertedUsers, (user) => user.email);
  const admin = requireRecord(usersByEmail, "kaloianh@gmail.com", "admin user");

  const insertedGroups = await db
    .insert(groups)
    .values(
      seedGroups.map((group) => ({
        ...group,
        imageUrl: imageUrl(group.title),
        createdByAdminId: admin.id,
        hacksCount: hackSeeds.filter((hack) => hack.groupSlug === group.slug)
          .length,
        membersCount: membershipsByGroup[group.slug]?.length ?? 0,
      })),
    )
    .returning();
  const groupsBySlug = toMap(insertedGroups, (group) => group.slug);

  const insertedCategories = await db
    .insert(categories)
    .values(seedCategories)
    .returning();
  const categoriesBySlug = toMap(insertedCategories, (category) => category.slug);

  const membershipRows = Object.entries(membershipsByGroup).flatMap(
    ([groupSlug, members]) => {
      const group = requireRecord(groupsBySlug, groupSlug, "group");

      return members.map((member) => ({
        groupId: group.id,
        userId: requireRecord(usersByEmail, member.email, "member user").id,
        groupRole: member.groupRole,
      }));
    },
  );
  await db.insert(groupMembers).values(membershipRows);

  const likesByHack = new Map<string, string[]>();
  const votesByHack = new Map<
    string,
    Array<{ email: string; voteType: "sweet_tomato" | "bitter_cucumber" }>
  >();
  const commentsByHack = new Map<
    string,
    Array<{ email: string; text: string }>
  >();

  for (const [index, hack] of hackSeeds.entries()) {
    const members = membershipsByGroup[hack.groupSlug]
      .map((member) => member.email)
      .filter((email) => email !== hack.authorEmail);
    const otherUsers = seedUsers
      .map((user) => user.email)
      .filter((email) => email !== hack.authorEmail);
    const voteOffset = index % otherUsers.length;
    const rotatedVoters = [
      ...otherUsers.slice(voteOffset),
      ...otherUsers.slice(0, voteOffset),
    ];
    const positiveVoters = rotatedVoters.slice(0, 5);
    const bitterVoters =
      index % 4 === 0 && rotatedVoters[5] ? [rotatedVoters[5]] : [];

    likesByHack.set(hack.key, positiveVoters.slice(0, 4));
    votesByHack.set(hack.key, [
      ...positiveVoters.map((email) => ({
        email,
        voteType: "sweet_tomato" as const,
      })),
      ...bitterVoters.map((email) => ({
        email,
        voteType: "bitter_cucumber" as const,
      })),
    ]);
    commentsByHack.set(
      hack.key,
      members.slice(0, 3).map((email, commentIndex) => ({
        email,
        text: commentTemplates[(index + commentIndex) % commentTemplates.length],
      })),
    );
  }

  const insertedHacks = await db
    .insert(gardeningHacks)
    .values(
      hackSeeds.map((hack) => {
        const votes = votesByHack.get(hack.key) ?? [];
        const sweetTomatoesCount = votes.filter(
          (vote) => vote.voteType === "sweet_tomato",
        ).length;
        const bitterCucumbersCount = votes.filter(
          (vote) => vote.voteType === "bitter_cucumber",
        ).length;

        return {
          title: hack.title,
          slug: hack.slug,
          content: hack.content,
          excerpt: hack.excerpt,
          imageUrl: imageUrl(hack.title),
          sourceUrl: YOUTUBE_INSPIRATION_URL,
          authorId: requireRecord(usersByEmail, hack.authorEmail, "hack author")
            .id,
          groupId: requireRecord(groupsBySlug, hack.groupSlug, "hack group").id,
          categoryId: requireRecord(
            categoriesBySlug,
            hack.categorySlug,
            "hack category",
          ).id,
          difficulty: hack.difficulty,
          status: "published" as const,
          isOrganic: true,
          isChemicalFree: true,
          pointsAwarded: PUBLISHED_HACK_POINTS,
          likesCount: likesByHack.get(hack.key)?.length ?? 0,
          commentsCount: commentsByHack.get(hack.key)?.length ?? 0,
          sweetTomatoesCount,
          bitterCucumbersCount,
          ratingScore: sweetTomatoesCount - bitterCucumbersCount,
        };
      }),
    )
    .returning();
  const hacksBySlug = toMap(insertedHacks, (hack) => hack.slug);
  const hackSlugByKey = new Map(hackSeeds.map((hack) => [hack.key, hack.slug]));

  const hackByKey = (key: string) => {
    const slug = hackSlugByKey.get(key);

    if (!slug) {
      throw new Error(`Missing hack seed key: ${key}`);
    }

    return requireRecord(hacksBySlug, slug, "hack");
  };

  const commentRows = [...commentsByHack.entries()].flatMap(
    ([hackKey, comments]) =>
      comments.map((comment) => ({
        hackId: hackByKey(hackKey).id,
        userId: requireRecord(usersByEmail, comment.email, "comment user").id,
        text: comment.text,
      })),
  );
  await db.insert(hackComments).values(commentRows);

  const likeRows = [...likesByHack.entries()].flatMap(([hackKey, emails]) =>
    emails.map((email) => ({
      hackId: hackByKey(hackKey).id,
      userId: requireRecord(usersByEmail, email, "like user").id,
    })),
  );
  await db.insert(hackLikes).values(likeRows);

  const voteRows = [...votesByHack.entries()].flatMap(([hackKey, votes]) =>
    votes.map((vote) => ({
      hackId: hackByKey(hackKey).id,
      userId: requireRecord(usersByEmail, vote.email, "vote user").id,
      voteType: vote.voteType,
      feedbackText:
        vote.voteType === "sweet_tomato"
          ? "Useful, practical, and easy to adapt."
          : "Interesting idea, but I would want more detail before trying it.",
    })),
  );
  await db.insert(hackVotes).values(voteRows);

  await db.insert(savedHacks).values(
    savedHackSeeds.map(([hackKey, email]) => ({
      hackId: hackByKey(hackKey).id,
      userId: requireRecord(usersByEmail, email, "saved hack user").id,
    })),
  );

  const pointsLedger = new Map<string, number>();
  const pointRows: Array<{
    userId: number;
    hackId: number | null;
    points: number;
    reason: string;
  }> = [];

  const addPoints = (
    email: string,
    points: number,
    reason: string,
    hackId: number | null,
  ) => {
    const user = requireRecord(usersByEmail, email, "points user");

    pointsLedger.set(email, (pointsLedger.get(email) ?? 0) + points);
    pointRows.push({
      userId: user.id,
      hackId,
      points,
      reason,
    });
  };

  addPoints("kaloianh@gmail.com", 50, "admin_bonus", null);

  for (const hack of hackSeeds) {
    const insertedHack = hackByKey(hack.key);
    const likes = likesByHack.get(hack.key) ?? [];
    const comments = commentsByHack.get(hack.key) ?? [];
    const votes = votesByHack.get(hack.key) ?? [];

    addPoints(
      hack.authorEmail,
      PUBLISHED_HACK_POINTS,
      "published_hack",
      insertedHack.id,
    );

    for (let index = 0; index < likes.length; index += 1) {
      addPoints(hack.authorEmail, 1, "received_like", insertedHack.id);
    }

    for (const vote of votes) {
      if (vote.voteType === "sweet_tomato") {
        addPoints(hack.authorEmail, 2, "received_sweet_tomato", insertedHack.id);
      }
    }

    for (let index = 0; index < comments.length; index += 1) {
      addPoints(hack.authorEmail, 1, "received_comment", insertedHack.id);
    }
  }

  await db.insert(userPointsLog).values(pointRows);

  for (const user of insertedUsers) {
    await db
      .update(users)
      .set({ pointsBalance: pointsLedger.get(user.email) ?? 0 })
      .where(eq(users.id, user.id));
  }

  console.log("Garden Hacks seed data created successfully.");
  console.log(
    `Inserted ${insertedUsers.length} users, ${insertedGroups.length} groups, ${insertedCategories.length} categories, ${insertedHacks.length} published hacks, ${commentRows.length} comments, ${likeRows.length} likes, ${voteRows.length} votes, and ${pointRows.length} point log records.`,
  );
};

runSeed().catch((error: unknown) => {
  console.error("Failed to seed Garden Hacks data.");
  console.error(error);
  process.exit(1);
});

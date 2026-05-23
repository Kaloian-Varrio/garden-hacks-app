export type PublicGroup = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  membersCount: number;
  hacksCount: number;
};

export type PublicGroupManager = {
  id: number;
  name: string;
  photoUrl: string | null;
};

export type PublicGroupDetail = PublicGroup & {
  managers: PublicGroupManager[];
  hacks: PublicHack[];
  viewerMembership: {
    id: number;
    groupRole: "member" | "manager";
  } | null;
};

export type PublicHackComment = {
  id: number;
  author: string;
  text: string;
};

export type PublicHack = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  category: string;
  group: string;
  groupSlug: string;
  author: string;
  difficulty: "easy" | "medium" | "hard";
  isOrganic: boolean;
  isChemicalFree: boolean;
  sweetTomatoesCount: number;
  bitterCucumbersCount: number;
  ratingScore: number;
  commentsCount: number;
  comments: PublicHackComment[];
};

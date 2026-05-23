export type SelectOption = {
  id: number;
  title: string;
};

export type DashboardHackFormValues = {
  title: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  sourceUrl: string | null;
  groupId: number;
  categoryId: number;
  difficulty: "easy" | "medium" | "hard";
  isOrganic: boolean;
  isChemicalFree: boolean;
  status: "draft" | "published" | "archived";
};

export type DashboardHackListItem = {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  group: string;
  category: string;
  sweetTomatoesCount: number;
  bitterCucumbersCount: number;
  ratingScore: number;
  commentsCount: number;
  createdAt: Date;
};

export type DashboardActivityItem = {
  id: number;
  reason: string;
  points: number;
  hackTitle: string | null;
  createdAt: Date;
};

export type DashboardSavedHackItem = {
  id: number;
  savedAt: Date;
  hack: {
    title: string;
    slug: string;
    group: string;
    category: string;
    ratingScore: number;
  };
};

export type DashboardGroupItem = {
  membershipId: number;
  groupId: number;
  title: string;
  slug: string;
  description: string | null;
  groupRole: "member" | "manager";
  membersCount: number;
  hacksCount: number;
};

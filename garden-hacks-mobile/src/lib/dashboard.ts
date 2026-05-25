import { getApiBaseUrl } from "./auth";

export type MobileDashboardHack = {
  id: number;
  title: string;
  slug: string;
  status?: "draft" | "published" | "archived";
  excerpt?: string | null;
  imageUrl?: string | null;
  ratingScore: number;
  commentsCount?: number;
  createdAt?: string;
  group: {
    id: number;
    title: string;
    slug: string;
  };
  category: {
    id: number;
    title: string;
    slug: string;
  };
};

export type MobileDashboardGroup = {
  membershipId: number;
  groupRole: "member" | "manager";
  joinedAt: string;
  id: number;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  membersCount: number;
  hacksCount: number;
};

export type MobileDashboardActivity = {
  id: number;
  reason: string;
  points: number;
  hackTitle: string | null;
  createdAt: string;
};

export type MobileDashboardSavedHack = {
  id: number;
  savedAt: string;
  hack: MobileDashboardHack;
};

export type MobileDashboard = {
  user: {
    id: number;
    email: string;
    name: string;
    role: "user" | "admin";
    photoUrl: string | null;
  };
  pointsBalance: number;
  publishedHacksCount: number;
  joinedGroupsCount: number;
  savedHacksCount: number;
  recentUserHacks: MobileDashboardHack[];
  recentActivity: MobileDashboardActivity[];
  savedHacks: MobileDashboardSavedHack[];
  joinedGroups: MobileDashboardGroup[];
};

export async function fetchMobileDashboard(token: string) {
  const response = await fetch(`${getApiBaseUrl()}/mobile/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load dashboard.");
  }

  return response.json() as Promise<MobileDashboard>;
}

export function formatActivityReason(reason: string) {
  return reason
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

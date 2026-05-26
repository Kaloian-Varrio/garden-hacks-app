export type UserGroupListItem = {
  membershipId: number;
  groupId: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  groupRole: "member" | "manager" | "admin";
  membersCount: number;
  hacksCount: number;
  canManage: boolean;
};

export type GroupMemberItem = {
  id: number;
  name: string;
  photoUrl: string | null;
  groupRole: "member" | "manager";
  joinedAt: Date;
};

export type GroupHackItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  author: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  sweetTomatoesCount: number;
  bitterCucumbersCount: number;
  ratingScore: number;
  commentsCount: number;
};

export type UserGroupDetail = {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  membersCount: number;
  hacksCount: number;
  viewerRole: "member" | "manager" | "admin";
  canManage: boolean;
  managers: GroupMemberItem[];
  members: GroupMemberItem[];
  hacks: GroupHackItem[];
};

export type GroupFormValues = {
  id?: number;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
};

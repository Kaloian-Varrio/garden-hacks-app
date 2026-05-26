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
  authorId: number;
  author: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  status: "draft" | "published" | "archived";
  sweetTomatoesCount: number;
  bitterCucumbersCount: number;
  ratingScore: number;
  commentsCount: number;
  createdAt: Date;
  canManage: boolean;
};

export type UserGroupDetail = {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  membersCount: number;
  hacksCount: number;
  viewerRole: "member" | "manager" | "admin";
  viewerIsMember: boolean;
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

export type LeaveGroupInfo = {
  id: number;
  title: string;
  membershipId: number;
  groupRole: "member" | "manager";
  managerCount: number;
};

export type ManagedGroupMemberItem = {
  membershipId: number;
  userId: number;
  name: string;
  email: string;
  groupRole: "member" | "manager";
  joinedAt: Date;
  isCurrentUser: boolean;
};

export type ManagedGroupMembers = {
  id: number;
  title: string;
  membersCount: number;
  managerCount: number;
  members: ManagedGroupMemberItem[];
};

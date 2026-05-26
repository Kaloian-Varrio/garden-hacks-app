import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const groupRoleEnum = pgEnum("group_role", ["member", "manager"]);
export const hackDifficultyEnum = pgEnum("hack_difficulty", [
  "easy",
  "medium",
  "hard",
]);
export const hackStatusEnum = pgEnum("hack_status", [
  "draft",
  "published",
  "archived",
]);
export const voteTypeEnum = pgEnum("vote_type", [
  "sweet_tomato",
  "bitter_cucumber",
]);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    photoUrl: text("photo_url"),
    bio: text("bio"),
    role: userRoleEnum("role").notNull().default("user"),
    pointsBalance: integer("points_balance").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    index("users_email_idx").on(table.email),
    index("users_role_idx").on(table.role),
  ],
);

export const groups = pgTable(
  "groups",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    createdByAdminId: integer("created_by_admin_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    hacksCount: integer("hacks_count").notNull().default(0),
    membersCount: integer("members_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("groups_slug_unique").on(table.slug),
    index("groups_slug_idx").on(table.slug),
  ],
);

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("categories_slug_unique").on(table.slug),
    index("categories_slug_idx").on(table.slug),
  ],
);

export const groupMembers = pgTable(
  "group_members",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    groupRole: groupRoleEnum("group_role").notNull().default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("group_members_group_id_user_id_unique").on(
      table.groupId,
      table.userId,
    ),
    index("group_members_group_id_idx").on(table.groupId),
    index("group_members_user_id_idx").on(table.userId),
    index("group_members_group_role_idx").on(table.groupRole),
  ],
);

export const groupInvitations = pgTable(
  "group_invitations",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    inviteCode: varchar("invite_code", { length: 96 }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    usedByUserId: integer("used_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdByUserId: integer("created_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("group_invitations_invite_code_unique").on(table.inviteCode),
    index("group_invitations_group_id_idx").on(table.groupId),
    index("group_invitations_used_at_idx").on(table.usedAt),
    index("group_invitations_created_by_user_id_idx").on(
      table.createdByUserId,
    ),
    index("group_invitations_used_by_user_id_idx").on(table.usedByUserId),
  ],
);

export const gardeningHacks = pgTable(
  "gardening_hacks",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 220 }).notNull(),
    slug: varchar("slug", { length: 240 }).notNull(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    imageUrl: text("image_url"),
    sourceUrl: text("source_url"),
    authorId: integer("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    difficulty: hackDifficultyEnum("difficulty").notNull().default("easy"),
    status: hackStatusEnum("status").notNull().default("draft"),
    isOrganic: boolean("is_organic").notNull().default(true),
    isChemicalFree: boolean("is_chemical_free").notNull().default(true),
    pointsAwarded: integer("points_awarded").notNull().default(0),
    likesCount: integer("likes_count").notNull().default(0),
    commentsCount: integer("comments_count").notNull().default(0),
    sweetTomatoesCount: integer("sweet_tomatoes_count").notNull().default(0),
    bitterCucumbersCount: integer("bitter_cucumbers_count")
      .notNull()
      .default(0),
    ratingScore: integer("rating_score").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("gardening_hacks_slug_unique").on(table.slug),
    index("gardening_hacks_slug_idx").on(table.slug),
    index("gardening_hacks_author_id_idx").on(table.authorId),
    index("gardening_hacks_group_id_idx").on(table.groupId),
    index("gardening_hacks_category_id_idx").on(table.categoryId),
    index("gardening_hacks_status_idx").on(table.status),
    index("gardening_hacks_rating_score_idx").on(table.ratingScore),
    index("gardening_hacks_created_at_idx").on(table.createdAt),
  ],
);

export const hackComments = pgTable(
  "hack_comments",
  {
    id: serial("id").primaryKey(),
    hackId: integer("hack_id")
      .notNull()
      .references(() => gardeningHacks.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("hack_comments_hack_id_idx").on(table.hackId),
    index("hack_comments_user_id_idx").on(table.userId),
  ],
);

export const hackLikes = pgTable(
  "hack_likes",
  {
    id: serial("id").primaryKey(),
    hackId: integer("hack_id")
      .notNull()
      .references(() => gardeningHacks.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("hack_likes_hack_id_user_id_unique").on(
      table.hackId,
      table.userId,
    ),
    index("hack_likes_hack_id_idx").on(table.hackId),
    index("hack_likes_user_id_idx").on(table.userId),
  ],
);

export const hackVotes = pgTable(
  "hack_votes",
  {
    id: serial("id").primaryKey(),
    hackId: integer("hack_id")
      .notNull()
      .references(() => gardeningHacks.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    voteType: voteTypeEnum("vote_type").notNull(),
    feedbackText: text("feedback_text"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("hack_votes_hack_id_user_id_unique").on(
      table.hackId,
      table.userId,
    ),
    index("hack_votes_hack_id_idx").on(table.hackId),
    index("hack_votes_user_id_idx").on(table.userId),
  ],
);

export const savedHacks = pgTable(
  "saved_hacks",
  {
    id: serial("id").primaryKey(),
    hackId: integer("hack_id")
      .notNull()
      .references(() => gardeningHacks.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("saved_hacks_hack_id_user_id_unique").on(
      table.hackId,
      table.userId,
    ),
    index("saved_hacks_user_id_idx").on(table.userId),
    index("saved_hacks_hack_id_idx").on(table.hackId),
  ],
);

export const userPointsLog = pgTable(
  "user_points_log",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    hackId: integer("hack_id").references(() => gardeningHacks.id, {
      onDelete: "set null",
    }),
    points: integer("points").notNull(),
    reason: varchar("reason", { length: 80 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("user_points_log_user_id_idx").on(table.userId),
    index("user_points_log_hack_id_idx").on(table.hackId),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  gardeningHacks: many(gardeningHacks),
  comments: many(hackComments),
  groupMemberships: many(groupMembers),
  createdGroupInvitations: many(groupInvitations, {
    relationName: "createdGroupInvitations",
  }),
  usedGroupInvitations: many(groupInvitations, {
    relationName: "usedGroupInvitations",
  }),
  savedHacks: many(savedHacks),
  likes: many(hackLikes),
  votes: many(hackVotes),
  pointsLog: many(userPointsLog),
  createdGroups: many(groups),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  createdByAdmin: one(users, {
    fields: [groups.createdByAdminId],
    references: [users.id],
  }),
  members: many(groupMembers),
  invitations: many(groupInvitations),
  gardeningHacks: many(gardeningHacks),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));

export const groupInvitationsRelations = relations(
  groupInvitations,
  ({ one }) => ({
    group: one(groups, {
      fields: [groupInvitations.groupId],
      references: [groups.id],
    }),
    createdByUser: one(users, {
      fields: [groupInvitations.createdByUserId],
      references: [users.id],
      relationName: "createdGroupInvitations",
    }),
    usedByUser: one(users, {
      fields: [groupInvitations.usedByUserId],
      references: [users.id],
      relationName: "usedGroupInvitations",
    }),
  }),
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  gardeningHacks: many(gardeningHacks),
}));

export const gardeningHacksRelations = relations(
  gardeningHacks,
  ({ one, many }) => ({
    author: one(users, {
      fields: [gardeningHacks.authorId],
      references: [users.id],
    }),
    group: one(groups, {
      fields: [gardeningHacks.groupId],
      references: [groups.id],
    }),
    category: one(categories, {
      fields: [gardeningHacks.categoryId],
      references: [categories.id],
    }),
    comments: many(hackComments),
    likes: many(hackLikes),
    votes: many(hackVotes),
    savedHacks: many(savedHacks),
    pointsLog: many(userPointsLog),
  }),
);

export const hackCommentsRelations = relations(hackComments, ({ one }) => ({
  hack: one(gardeningHacks, {
    fields: [hackComments.hackId],
    references: [gardeningHacks.id],
  }),
  user: one(users, {
    fields: [hackComments.userId],
    references: [users.id],
  }),
}));

export const hackLikesRelations = relations(hackLikes, ({ one }) => ({
  hack: one(gardeningHacks, {
    fields: [hackLikes.hackId],
    references: [gardeningHacks.id],
  }),
  user: one(users, {
    fields: [hackLikes.userId],
    references: [users.id],
  }),
}));

export const hackVotesRelations = relations(hackVotes, ({ one }) => ({
  hack: one(gardeningHacks, {
    fields: [hackVotes.hackId],
    references: [gardeningHacks.id],
  }),
  user: one(users, {
    fields: [hackVotes.userId],
    references: [users.id],
  }),
}));

export const savedHacksRelations = relations(savedHacks, ({ one }) => ({
  hack: one(gardeningHacks, {
    fields: [savedHacks.hackId],
    references: [gardeningHacks.id],
  }),
  user: one(users, {
    fields: [savedHacks.userId],
    references: [users.id],
  }),
}));

export const userPointsLogRelations = relations(userPointsLog, ({ one }) => ({
  user: one(users, {
    fields: [userPointsLog.userId],
    references: [users.id],
  }),
  hack: one(gardeningHacks, {
    fields: [userPointsLog.hackId],
    references: [gardeningHacks.id],
  }),
}));

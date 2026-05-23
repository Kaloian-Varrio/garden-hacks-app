CREATE TYPE "public"."group_role" AS ENUM('member', 'manager');--> statement-breakpoint
CREATE TYPE "public"."hack_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."hack_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."vote_type" AS ENUM('sweet_tomato', 'bitter_cucumber');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(160) NOT NULL,
	"slug" varchar(180) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gardening_hacks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(220) NOT NULL,
	"slug" varchar(240) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"image_url" text,
	"source_url" text,
	"author_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"difficulty" "hack_difficulty" DEFAULT 'easy' NOT NULL,
	"status" "hack_status" DEFAULT 'draft' NOT NULL,
	"is_organic" boolean DEFAULT true NOT NULL,
	"is_chemical_free" boolean DEFAULT true NOT NULL,
	"points_awarded" integer DEFAULT 0 NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"sweet_tomatoes_count" integer DEFAULT 0 NOT NULL,
	"bitter_cucumbers_count" integer DEFAULT 0 NOT NULL,
	"rating_score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"group_role" "group_role" DEFAULT 'member' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(160) NOT NULL,
	"slug" varchar(180) NOT NULL,
	"description" text,
	"image_url" text,
	"created_by_admin_id" integer NOT NULL,
	"hacks_count" integer DEFAULT 0 NOT NULL,
	"members_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hack_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"hack_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hack_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"hack_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hack_votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"hack_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"vote_type" "vote_type" NOT NULL,
	"feedback_text" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_hacks" (
	"id" serial PRIMARY KEY NOT NULL,
	"hack_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_points_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"hack_id" integer,
	"points" integer NOT NULL,
	"reason" varchar(80) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(120) NOT NULL,
	"photo_url" text,
	"bio" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"points_balance" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gardening_hacks" ADD CONSTRAINT "gardening_hacks_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gardening_hacks" ADD CONSTRAINT "gardening_hacks_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gardening_hacks" ADD CONSTRAINT "gardening_hacks_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_created_by_admin_id_users_id_fk" FOREIGN KEY ("created_by_admin_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hack_comments" ADD CONSTRAINT "hack_comments_hack_id_gardening_hacks_id_fk" FOREIGN KEY ("hack_id") REFERENCES "public"."gardening_hacks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hack_comments" ADD CONSTRAINT "hack_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hack_likes" ADD CONSTRAINT "hack_likes_hack_id_gardening_hacks_id_fk" FOREIGN KEY ("hack_id") REFERENCES "public"."gardening_hacks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hack_likes" ADD CONSTRAINT "hack_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hack_votes" ADD CONSTRAINT "hack_votes_hack_id_gardening_hacks_id_fk" FOREIGN KEY ("hack_id") REFERENCES "public"."gardening_hacks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hack_votes" ADD CONSTRAINT "hack_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_hacks" ADD CONSTRAINT "saved_hacks_hack_id_gardening_hacks_id_fk" FOREIGN KEY ("hack_id") REFERENCES "public"."gardening_hacks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_hacks" ADD CONSTRAINT "saved_hacks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_points_log" ADD CONSTRAINT "user_points_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_points_log" ADD CONSTRAINT "user_points_log_hack_id_gardening_hacks_id_fk" FOREIGN KEY ("hack_id") REFERENCES "public"."gardening_hacks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_unique" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "gardening_hacks_slug_unique" ON "gardening_hacks" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "gardening_hacks_slug_idx" ON "gardening_hacks" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "gardening_hacks_author_id_idx" ON "gardening_hacks" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "gardening_hacks_group_id_idx" ON "gardening_hacks" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "gardening_hacks_category_id_idx" ON "gardening_hacks" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "gardening_hacks_status_idx" ON "gardening_hacks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "gardening_hacks_rating_score_idx" ON "gardening_hacks" USING btree ("rating_score");--> statement-breakpoint
CREATE INDEX "gardening_hacks_created_at_idx" ON "gardening_hacks" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "group_members_group_id_user_id_unique" ON "group_members" USING btree ("group_id","user_id");--> statement-breakpoint
CREATE INDEX "group_members_group_id_idx" ON "group_members" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "group_members_user_id_idx" ON "group_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "group_members_group_role_idx" ON "group_members" USING btree ("group_role");--> statement-breakpoint
CREATE UNIQUE INDEX "groups_slug_unique" ON "groups" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "groups_slug_idx" ON "groups" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "hack_comments_hack_id_idx" ON "hack_comments" USING btree ("hack_id");--> statement-breakpoint
CREATE INDEX "hack_comments_user_id_idx" ON "hack_comments" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "hack_likes_hack_id_user_id_unique" ON "hack_likes" USING btree ("hack_id","user_id");--> statement-breakpoint
CREATE INDEX "hack_likes_hack_id_idx" ON "hack_likes" USING btree ("hack_id");--> statement-breakpoint
CREATE INDEX "hack_likes_user_id_idx" ON "hack_likes" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "hack_votes_hack_id_user_id_unique" ON "hack_votes" USING btree ("hack_id","user_id");--> statement-breakpoint
CREATE INDEX "hack_votes_hack_id_idx" ON "hack_votes" USING btree ("hack_id");--> statement-breakpoint
CREATE INDEX "hack_votes_user_id_idx" ON "hack_votes" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "saved_hacks_hack_id_user_id_unique" ON "saved_hacks" USING btree ("hack_id","user_id");--> statement-breakpoint
CREATE INDEX "saved_hacks_user_id_idx" ON "saved_hacks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "saved_hacks_hack_id_idx" ON "saved_hacks" USING btree ("hack_id");--> statement-breakpoint
CREATE INDEX "user_points_log_user_id_idx" ON "user_points_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_points_log_hack_id_idx" ON "user_points_log" USING btree ("hack_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");
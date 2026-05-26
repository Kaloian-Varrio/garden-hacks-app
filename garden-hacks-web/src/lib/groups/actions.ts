"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, groupMembers, groups } from "@/db";
import { getCurrentUser } from "@/lib/auth/session";
import { slugify } from "@/lib/dashboard/slug";
import { isAdmin, requireGroupManager } from "./authorization";

export type GroupActionState = {
  errors?: {
    title?: string;
    slug?: string;
    form?: string;
  };
  values?: {
    title?: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
  };
};

export async function createGroupAction(
  _previousState: GroupActionState,
  formData: FormData,
): Promise<GroupActionState> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!isAdmin(user)) {
    return {
      errors: {
        form: "Only admins can create groups.",
      },
      values: readGroupFormValues(formData),
    };
  }

  const parsed = await parseGroupForm(formData);

  if (!parsed.ok) {
    return parsed.state;
  }

  const [group] = await db
    .insert(groups)
    .values({
      title: parsed.values.title,
      slug: parsed.values.slug,
      description: parsed.values.description || null,
      imageUrl: parsed.values.imageUrl || null,
      createdByAdminId: user.id,
      membersCount: 1,
    })
    .returning({ id: groups.id });

  await db.insert(groupMembers).values({
    groupId: group.id,
    userId: user.id,
    groupRole: "manager",
  });

  revalidatePath("/groups");
  redirect(`/groups/${group.id}`);
}

export async function updateGroupAction(
  groupId: number,
  _previousState: GroupActionState,
  formData: FormData,
): Promise<GroupActionState> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const canManage = await requireGroupManager(user, groupId);

  if (!canManage) {
    return {
      errors: {
        form: "Only group managers and admins can edit this group.",
      },
      values: readGroupFormValues(formData),
    };
  }

  const parsed = await parseGroupForm(formData, groupId);

  if (!parsed.ok) {
    return parsed.state;
  }

  await db
    .update(groups)
    .set({
      title: parsed.values.title,
      slug: parsed.values.slug,
      description: parsed.values.description || null,
      imageUrl: parsed.values.imageUrl || null,
      updatedAt: new Date(),
    })
    .where(eq(groups.id, groupId));

  revalidatePath("/groups");
  revalidatePath(`/groups/${groupId}`);
  redirect(`/groups/${groupId}`);
}

export async function deleteGroupAction(groupId: number) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const canManage = await requireGroupManager(user, groupId);

  if (!canManage) {
    redirect(`/groups/${groupId}`);
  }

  await db.delete(groups).where(eq(groups.id, groupId));

  revalidatePath("/groups");
  redirect("/groups");
}

function readGroupFormValues(formData: FormData) {
  return {
    title: readFormString(formData, "title"),
    slug: readFormString(formData, "slug"),
    description: readFormString(formData, "description"),
    imageUrl: readFormString(formData, "imageUrl"),
  };
}

async function parseGroupForm(formData: FormData, existingGroupId?: number) {
  const values = readGroupFormValues(formData);
  const slug = slugify(values.slug || values.title);
  const errors: GroupActionState["errors"] = {};

  if (!values.title) {
    errors.title = "Title is required.";
  }

  if (!slug) {
    errors.slug = "Slug is required.";
  }

  if (slug) {
    const existing = await db.query.groups.findFirst({
      where: eq(groups.slug, slug),
      columns: {
        id: true,
      },
    });

    if (existing && existing.id !== existingGroupId) {
      errors.slug = "Slug must be unique.";
    }
  }

  if (errors.title || errors.slug) {
    return {
      ok: false as const,
      state: {
        errors,
        values: {
          ...values,
          slug,
        },
      },
    };
  }

  return {
    ok: true as const,
    values: {
      title: values.title,
      slug,
      description: values.description,
      imageUrl: values.imageUrl,
    },
  };
}

function readFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

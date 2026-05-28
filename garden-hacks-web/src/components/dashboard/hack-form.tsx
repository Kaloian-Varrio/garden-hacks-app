"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DashboardHackFormValues, SelectOption } from "@/lib/dashboard/types";

type HackFormProps = {
  mode: "create" | "edit";
  hackId?: number;
  groups: SelectOption[];
  categories: SelectOption[];
  initialValues?: Partial<DashboardHackFormValues>;
};

const defaultValues: DashboardHackFormValues = {
  title: "",
  excerpt: "",
  content: "",
  imageUrl: "",
  sourceUrl: "",
  groupId: 0,
  categoryId: 0,
  difficulty: "easy",
  isOrganic: true,
  isChemicalFree: true,
  status: "draft",
};

export function HackForm({
  mode,
  hackId,
  groups,
  categories,
  initialValues,
}: HackFormProps) {
  const router = useRouter();
  const values = { ...defaultValues, ...initialValues };
  const [error, setError] = useState("");
  const [createdHackHref, setCreatedHackHref] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCreatedHackHref("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const imageFile = formData.get("imageFile");

    if (imageFile instanceof File && imageFile.size > 0) {
      if (imageFile.size > 1024 * 1024) {
        setError("Image file must be up to 1 MB.");
        setIsSubmitting(false);
        return;
      }

      // TODO: Persist uploaded image files when a web image upload API exists.
    }

    const payload = {
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      imageUrl: formData.get("imageUrl"),
      groupId: Number(formData.get("groupId")),
      categoryId: Number(formData.get("categoryId")),
      difficulty: formData.get("difficulty"),
      isOrganic: formData.get("isOrganic") === "on",
      isChemicalFree: formData.get("isChemicalFree") === "on",
      status: formData.get("status"),
    };
    const response = await fetch(mode === "create" ? "/api/hacks" : `/api/hacks/${hackId}`, {
      method: mode === "create" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = (await response.json().catch(() => null)) as {
      error?: string;
      hack?: {
        slug?: string;
      };
    } | null;

    setIsSubmitting(false);

    if (!response.ok) {
      setError(result?.error ?? "Unable to save this hack.");
      return;
    }

    if (mode === "create") {
      if (result?.hack?.slug) {
        setCreatedHackHref(`/hacks/${result.hack.slug}`);
      }

      router.refresh();
      return;
    }

    router.push("/dashboard/hacks");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {error ? (
        <p className="rounded-md border border-[#efb5a8] bg-[#fff0eb] px-4 py-3 text-sm font-semibold text-[#8a2d1c]">
          {error}
        </p>
      ) : null}
      {createdHackHref ? (
        <div className="rounded-md border border-[#b7e7d1] bg-[#e9fbef] px-4 py-3 text-sm font-semibold text-[#134c40]">
          Hack created successfully.
          <Link
            href={createdHackHref}
            className="ml-2 inline-flex font-black text-[#0f766e] hover:text-[#f0643c]"
          >
            View hack
          </Link>
        </div>
      ) : null}
      <Field label="Title">
        <input
          name="title"
          defaultValue={values.title}
          required
          maxLength={220}
          className="dashboard-input"
        />
      </Field>
      <Field label="Excerpt">
        <textarea
          name="excerpt"
          defaultValue={values.excerpt ?? ""}
          rows={3}
          className="dashboard-input min-h-24 py-3"
        />
      </Field>
      <Field label="Content">
        <textarea
          name="content"
          defaultValue={values.content}
          required
          rows={8}
          className="dashboard-input min-h-48 py-3"
        />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Image URL">
          <input
            name="imageUrl"
            type="url"
            defaultValue={values.imageUrl ?? ""}
            className="dashboard-input"
          />
        </Field>
        <Field label="Upload image file (up to 1 MB)">
          <input
            name="imageFile"
            type="file"
            accept="image/*"
            className="dashboard-input file:mr-4 file:rounded-md file:border-0 file:bg-[#dff8e9] file:px-3 file:py-2 file:text-sm file:font-bold file:text-[#0f766e]"
          />
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Group">
          <select
            name="groupId"
            required
            defaultValue={values.groupId || ""}
            className="dashboard-input"
          >
            <option value="">Select group</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Category">
          <select
            name="categoryId"
            required
            defaultValue={values.categoryId || ""}
            className="dashboard-input"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Difficulty">
          <select
            name="difficulty"
            defaultValue={values.difficulty}
            className="dashboard-input"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={values.status} className="dashboard-input">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
      </div>
      <div className="grid gap-3 rounded-lg border border-[#dfe8d8] bg-[#f8faf7] p-4 sm:grid-cols-2">
        <label className="flex items-center gap-3 text-sm font-semibold text-[#405046]">
          <input
            name="isOrganic"
            type="checkbox"
            defaultChecked={values.isOrganic}
            className="h-4 w-4 accent-[#2f6f3e]"
          />
          Organic
        </label>
        <label className="flex items-center gap-3 text-sm font-semibold text-[#405046]">
          <input
            name="isChemicalFree"
            type="checkbox"
            defaultChecked={values.isChemicalFree}
            className="h-4 w-4 accent-[#2f6f3e]"
          />
          Chemical-free
        </label>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#2f6f3e] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#285d35] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create hack"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#405046]">
      {label}
      {children}
    </label>
  );
}

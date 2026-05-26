"use client";

import { useActionState } from "react";
import type {
  GroupHackActionState,
  GroupHackFormOptions,
  GroupHackFormValues,
} from "@/lib/group-hacks/types";

type GroupHackFormProps = {
  action: (
    previousState: GroupHackActionState,
    formData: FormData,
  ) => Promise<GroupHackActionState>;
  initialValues?: Partial<GroupHackFormValues>;
  options: GroupHackFormOptions;
  submitLabel: string;
};

const defaultValues: GroupHackFormValues = {
  title: "",
  excerpt: "",
  content: "",
  imageUrl: "",
  sourceUrl: "",
  categoryId: 0,
  difficulty: "easy",
  isOrganic: true,
  isChemicalFree: true,
  status: "draft",
};

const initialState: GroupHackActionState = {};

export function GroupHackForm({
  action,
  initialValues,
  options,
  submitLabel,
}: GroupHackFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const values = { ...defaultValues, ...initialValues, ...state.values };

  return (
    <form action={formAction} className="grid gap-5">
      {state.errors?.form ? (
        <p className="rounded-md border border-[#efb5a8] bg-[#fff0eb] px-4 py-3 text-sm font-semibold text-[#8a2d1c]">
          {state.errors.form}
        </p>
      ) : null}

      <Field label="Title" error={state.errors?.title}>
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

      <Field label="Content" error={state.errors?.content}>
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
        <Field label="Source URL">
          <input
            name="sourceUrl"
            type="url"
            defaultValue={values.sourceUrl ?? ""}
            className="dashboard-input"
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Category" error={state.errors?.categoryId}>
          <select
            name="categoryId"
            required
            defaultValue={values.categoryId || ""}
            className="dashboard-input"
          >
            <option value="">Select category</option>
            {options.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </Field>
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
      </div>

      <Field label="Status">
        <select name="status" defaultValue={values.status} className="dashboard-input">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </Field>

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

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-[#2f6f3e] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#285d35] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function Field({
  children,
  error,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#405046]">
      {label}
      {children}
      {error ? <span className="text-[#8a2d1c]">{error}</span> : null}
    </label>
  );
}

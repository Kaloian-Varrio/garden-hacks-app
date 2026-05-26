"use client";

import { useActionState } from "react";
import type { GroupActionState } from "@/lib/groups/actions";
import type { GroupFormValues } from "@/lib/groups/types";

type GroupFormProps = {
  action: (
    previousState: GroupActionState,
    formData: FormData,
  ) => Promise<GroupActionState>;
  submitLabel: string;
  initialValues?: GroupFormValues;
};

const initialState: GroupActionState = {};

export function GroupForm({
  action,
  initialValues,
  submitLabel,
}: GroupFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const values = state.values ?? initialValues;

  return (
    <form action={formAction} className="grid gap-5">
      {state.errors?.form ? (
        <div className="rounded-md border border-[#efb5a8] bg-[#fff0eb] p-3 text-sm font-semibold text-[#8a2d1c]">
          {state.errors.form}
        </div>
      ) : null}

      <FieldError message={state.errors?.title} />
      <label className="grid gap-2 text-sm font-bold text-[#203525]">
        Title
        <input
          name="title"
          defaultValue={values?.title ?? ""}
          required
          maxLength={160}
          className="h-11 rounded-md border border-[#cbd9c2] bg-[#f8faf7] px-3 text-sm font-semibold text-[#18231c] outline-none focus:border-[#2f6f3e] focus:ring-2 focus:ring-[#cfe4c5]"
        />
      </label>

      <FieldError message={state.errors?.slug} />
      <label className="grid gap-2 text-sm font-bold text-[#203525]">
        Slug
        <input
          name="slug"
          defaultValue={values?.slug ?? ""}
          maxLength={180}
          placeholder="auto-generated from title"
          className="h-11 rounded-md border border-[#cbd9c2] bg-[#f8faf7] px-3 text-sm font-semibold text-[#18231c] outline-none focus:border-[#2f6f3e] focus:ring-2 focus:ring-[#cfe4c5]"
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-[#203525]">
        Description
        <textarea
          name="description"
          defaultValue={values?.description ?? ""}
          className="min-h-36 rounded-md border border-[#cbd9c2] bg-[#f8faf7] p-3 text-sm leading-6 text-[#18231c] outline-none focus:border-[#2f6f3e] focus:ring-2 focus:ring-[#cfe4c5]"
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-[#203525]">
        Image URL
        <input
          name="imageUrl"
          defaultValue={values?.imageUrl ?? ""}
          type="url"
          className="h-11 rounded-md border border-[#cbd9c2] bg-[#f8faf7] px-3 text-sm font-semibold text-[#18231c] outline-none focus:border-[#2f6f3e] focus:ring-2 focus:ring-[#cfe4c5]"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-[#2f6f3e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#285d35] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="-mb-3 text-sm font-semibold text-[#8a2d1c]">{message}</p>
  ) : null;
}

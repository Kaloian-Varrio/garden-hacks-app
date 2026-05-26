"use client";

import { useActionState, useState } from "react";
import {
  createGroupInviteAction,
  type InviteActionState,
} from "@/lib/group-invitations/actions";

type CreateInviteLinkProps = {
  groupId: number;
};

const initialState: InviteActionState = {};

export function CreateInviteLink({ groupId }: CreateInviteLinkProps) {
  const action = createGroupInviteAction.bind(null, groupId);
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [copyStatus, setCopyStatus] = useState("");

  async function copyInviteLink() {
    if (!state.inviteUrl) {
      return;
    }

    await navigator.clipboard.writeText(state.inviteUrl);
    setCopyStatus("Copied");
  }

  return (
    <div className="rounded-lg border border-[#dfe8d8] bg-[#f8faf7] p-4">
      <form action={formAction}>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#2f6f3e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#285d35] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Creating..." : "Create Invite Link"}
        </button>
      </form>
      {state.error ? (
        <p className="mt-3 text-sm font-semibold text-[#8a2d1c]">
          {state.error}
        </p>
      ) : null}
      {state.inviteUrl ? (
        <div className="mt-4 grid gap-3">
          <label className="grid gap-2 text-sm font-bold text-[#203525]">
            Invite link
            <input
              readOnly
              value={state.inviteUrl}
              className="h-11 rounded-md border border-[#cbd9c2] bg-white px-3 text-sm text-[#18231c]"
            />
          </label>
          <button
            type="button"
            onClick={copyInviteLink}
            className="inline-flex min-h-10 w-fit items-center justify-center rounded-md border border-[#b7c8ad] bg-white px-4 py-2 text-sm font-semibold text-[#203525] hover:bg-[#f1f7ed]"
          >
            {copyStatus || "Copy link"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

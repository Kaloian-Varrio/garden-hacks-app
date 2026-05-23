"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function GroupMembershipButton({
  groupId,
  isMember,
  isManager,
}: {
  groupId: number;
  isMember: boolean;
  isManager: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    setMessage("");
    setIsSubmitting(true);

    const response = await fetch(
      `/api/groups/${groupId}/${isMember ? "leave" : "join"}`,
      {
        method: "POST",
      },
    );
    const result = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(result?.error ?? "Unable to update group membership.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        disabled={isSubmitting || isManager}
        onClick={handleClick}
        className={`inline-flex min-h-11 items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-70 ${
          isMember
            ? "border border-[#efb5a8] bg-white text-[#8a2d1c] hover:bg-[#fff0eb]"
            : "bg-[#2f6f3e] text-white hover:bg-[#285d35]"
        }`}
      >
        {isSubmitting
          ? "Updating..."
          : isManager
            ? "Manager member"
            : isMember
              ? "Leave group"
              : "Join group"}
      </button>
      {isManager ? (
        <p className="text-xs leading-5 text-[#59655c]">
          Managers cannot leave from this public view.
        </p>
      ) : null}
      {message ? (
        <p className="rounded-md border border-[#efb5a8] bg-[#fff0eb] px-3 py-2 text-sm font-semibold text-[#8a2d1c]">
          {message}
        </p>
      ) : null}
    </div>
  );
}

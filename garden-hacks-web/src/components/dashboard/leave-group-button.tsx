"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LeaveGroupButton({ groupId }: { groupId: number }) {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  async function handleLeave() {
    if (!window.confirm("Leave this group?")) {
      return;
    }

    setIsLeaving(true);
    await fetch(`/api/dashboard/groups/${groupId}`, {
      method: "DELETE",
    });
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={isLeaving}
      onClick={handleLeave}
      className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#efb5a8] bg-white px-3 py-2 text-sm font-semibold text-[#8a2d1c] hover:bg-[#fff0eb] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLeaving ? "Leaving..." : "Leave group"}
    </button>
  );
}

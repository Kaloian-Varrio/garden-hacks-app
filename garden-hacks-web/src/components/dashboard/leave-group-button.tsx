"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TrashIcon } from "@/components/ui/garden-icons";

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
      className="garden-btn garden-btn-destructive min-h-10 gap-1 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <TrashIcon size={14} />
      {isLeaving ? "Leaving..." : "Leave group"}
    </button>
  );
}

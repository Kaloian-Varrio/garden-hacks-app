"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TrashIcon } from "@/components/ui/garden-icons";

export function DeleteHackButton({ hackId }: { hackId: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Delete this hack? This cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    await fetch(`/api/hacks/${hackId}`, {
      method: "DELETE",
    });
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={isDeleting}
      onClick={handleDelete}
      className="garden-btn garden-btn-destructive min-h-10 gap-1 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <TrashIcon size={14} />
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}

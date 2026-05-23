"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
      className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#efb5a8] bg-white px-3 py-2 text-sm font-semibold text-[#8a2d1c] hover:bg-[#fff0eb] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}

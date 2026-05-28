"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookmarkIcon } from "@/components/ui/garden-icons";

type SaveHackButtonProps = {
  hackId: number;
  initialIsSaved: boolean;
  isLoggedIn: boolean;
  compact?: boolean;
};

export function SaveHackButton({
  hackId,
  initialIsSaved,
  isLoggedIn,
  compact = false,
}: SaveHackButtonProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function toggleSaved() {
    if (!isLoggedIn || isPending) {
      return;
    }

    setError("");
    setIsPending(true);

    try {
      const response = await fetch(`/api/hacks/${hackId}/save`, {
        method: "POST",
      });
      const data = (await response.json().catch(() => null)) as {
        isSaved?: boolean;
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to save this hack.");
      }

      setIsSaved(Boolean(data?.isSaved));
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save this hack.",
      );
    } finally {
      setIsPending(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className={`garden-focus inline-flex items-center justify-center gap-2 rounded-full border border-[#d7e7df] bg-white/85 font-black text-[#59655c] shadow-sm transition hover:border-[#b7e7d1] hover:text-[#0f766e] ${
          compact ? "h-10 px-3 text-xs" : "h-11 px-4 text-sm"
        }`}
        title="Log in to save hacks"
      >
        <BookmarkIcon size={compact ? 16 : 18} />
        {compact ? "Save" : "Log in to save"}
      </Link>
    );
  }

  return (
    <div className="grid gap-1">
      <button
        type="button"
        aria-pressed={isSaved}
        disabled={isPending}
        onClick={toggleSaved}
        className={`garden-focus inline-flex items-center justify-center gap-2 rounded-full border font-black shadow-sm transition disabled:cursor-not-allowed disabled:opacity-70 ${
          isSaved
            ? "border-[#f6a13d] bg-[#fff2d6] text-[#9a4b12]"
            : "border-[#b7e7d1] bg-white/90 text-[#0f766e] hover:bg-[#e9fbef]"
        } ${compact ? "h-10 px-3 text-xs" : "h-11 px-4 text-sm"}`}
      >
        <BookmarkIcon size={compact ? 16 : 18} />
        {isPending ? "Saving..." : isSaved ? "Saved" : "Save"}
      </button>
      {error ? <p className="text-xs font-semibold text-[#8a2d1c]">{error}</p> : null}
    </div>
  );
}


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { CucumberIcon, TomatoIcon } from "@/components/ui/garden-icons";

type VoteType = "sweet_tomato" | "bitter_cucumber";

type HackVotePanelProps = {
  hackId: number;
  initialUserVote: VoteType | null;
  initialSweetTomatoesCount: number;
  initialBitterCucumbersCount: number;
  initialRatingScore: number;
  isLoggedIn: boolean;
  compact?: boolean;
};

export function HackVotePanel({
  hackId,
  initialUserVote,
  initialSweetTomatoesCount,
  initialBitterCucumbersCount,
  initialRatingScore,
  isLoggedIn,
  compact = false,
}: HackVotePanelProps) {
  const router = useRouter();
  const [userVote, setUserVote] = useState<VoteType | null>(initialUserVote);
  const [sweetTomatoesCount, setSweetTomatoesCount] = useState(
    initialSweetTomatoesCount,
  );
  const [bitterCucumbersCount, setBitterCucumbersCount] = useState(
    initialBitterCucumbersCount,
  );
  const [ratingScore, setRatingScore] = useState(initialRatingScore);
  const [pendingVote, setPendingVote] = useState<VoteType | null>(null);
  const [error, setError] = useState("");

  async function submitVote(voteType: VoteType) {
    if (!isLoggedIn) {
      setError("Log in to vote.");
      return;
    }

    setError("");
    setPendingVote(voteType);

    try {
      const response = await fetch(`/api/hacks/${hackId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voteType }),
      });
      const data = (await response.json().catch(() => null)) as {
        userVote?: VoteType;
        sweetTomatoesCount?: number;
        bitterCucumbersCount?: number;
        ratingScore?: number;
        error?: string;
        details?: Record<string, string>;
      } | null;

      if (!response.ok) {
        throw new Error(
          data?.details?.voteType ?? data?.error ?? "Unable to save your vote.",
        );
      }

      setUserVote(data?.userVote ?? voteType);
      setSweetTomatoesCount(data?.sweetTomatoesCount ?? sweetTomatoesCount);
      setBitterCucumbersCount(data?.bitterCucumbersCount ?? bitterCucumbersCount);
      setRatingScore(data?.ratingScore ?? ratingScore);
      router.refresh();
    } catch (voteError) {
      setError(
        voteError instanceof Error
          ? voteError.message
          : "Unable to save your vote.",
      );
    } finally {
      setPendingVote(null);
    }
  }

  return (
    <section className="garden-card-glass mt-6 rounded-3xl p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-[#18231c]">
            Vote for this hack
          </h2>
          {!compact ? (
            <p className="mt-1 text-sm leading-6 text-[#59655c]">
              Give helpful ideas Sweet Tomatoes or flag weak ones with Bitter
              Cucumbers.
            </p>
          ) : null}
        </div>
        <div className="rounded-full bg-white/80 px-3 py-1.5 text-sm font-black text-[#134c40] shadow-sm">
          Rating {ratingScore}
        </div>
      </div>

      <div className={`mt-4 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <VoteButton
          count={sweetTomatoesCount}
          icon={<TomatoIcon size={22} />}
          isActive={userVote === "sweet_tomato"}
          isDisabled={!isLoggedIn}
          isPending={pendingVote === "sweet_tomato"}
          label="Sweet Tomatoes"
          onClick={() => submitVote("sweet_tomato")}
        />
        <VoteButton
          count={bitterCucumbersCount}
          icon={<CucumberIcon size={22} />}
          isActive={userVote === "bitter_cucumber"}
          isDisabled={!isLoggedIn}
          isPending={pendingVote === "bitter_cucumber"}
          label="Bitter Cucumbers"
          onClick={() => submitVote("bitter_cucumber")}
        />
      </div>

      {error ? (
        <p className="garden-error-state mt-3 py-3 text-sm font-semibold">{error}</p>
      ) : null}

      {!isLoggedIn ? (
        <p className="mt-3 rounded-2xl border border-dashed border-[#b7e7d1] bg-white/65 px-4 py-3 text-sm text-[#59655c]">
          <Link href="/login" className="font-bold text-[#2f6f3e]">
            Log in
          </Link>{" "}
          to vote, or{" "}
          <Link href="/register" className="font-bold text-[#2f6f3e]">
            create an account
          </Link>
          .
        </p>
      ) : null}
    </section>
  );
}

function VoteButton({
  count,
  icon,
  isActive,
  isDisabled,
  isPending,
  label,
  onClick,
}: {
  count: number;
  icon: ReactNode;
  isActive: boolean;
  isDisabled: boolean;
  isPending: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      aria-label={`${label}: ${count} votes${isActive ? ", your current vote" : ""}`}
      disabled={isDisabled || isPending}
      onClick={onClick}
      className={`group relative flex min-h-20 items-center justify-between overflow-hidden rounded-3xl border px-4 py-3 text-left shadow-sm transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f9f93] disabled:cursor-not-allowed disabled:opacity-60 ${
        label === "Sweet Tomatoes"
          ? isActive
            ? "border-[#f0643c] bg-[#fff0eb] text-[#7a2d17] shadow-[#f0643c]/15"
            : "border-[#ffc2ad] bg-white text-[#7a2d17] hover:-translate-y-0.5 hover:border-[#f0643c] hover:bg-[#fff7f0] hover:shadow-lg hover:shadow-[#f0643c]/10"
          : isActive
            ? "border-[#38a15f] bg-[#e9fbef] text-[#134c40] shadow-[#38a15f]/15"
            : "border-[#aee7c3] bg-white text-[#134c40] hover:-translate-y-0.5 hover:border-[#38a15f] hover:bg-[#f4fff7] hover:shadow-lg hover:shadow-[#38a15f]/10"
      }`}
    >
      <span
        className={`absolute inset-y-0 left-0 w-1.5 ${
          label === "Sweet Tomatoes" ? "bg-[#f0643c]" : "bg-[#38a15f]"
        } ${isActive ? "opacity-100" : "opacity-35 group-hover:opacity-75"}`}
      />
      <span className="relative flex min-w-0 items-center gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            label === "Sweet Tomatoes"
              ? "bg-[#fff0eb] text-[#f0643c]"
              : "bg-[#e9fbef] text-[#38a15f]"
          }`}
        >
          {icon}
        </span>
        <span className="flex items-center gap-2 text-sm font-black">
          <span>
            <span className="block">{label}</span>
            <span className="mt-1 block text-xs font-bold uppercase tracking-[0.12em] text-[#59655c]">
              {isActive ? "Your vote" : isDisabled ? "Login required" : "Tap to vote"}
            </span>
          </span>
        </span>
      </span>
      <span className="relative rounded-2xl bg-white/80 px-3 py-2 text-3xl font-black shadow-sm">
        {isPending ? "..." : count}
      </span>
    </button>
  );
}

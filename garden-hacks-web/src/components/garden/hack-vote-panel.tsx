"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <section className="mt-6 rounded-lg border border-[#dfe8d8] bg-[#f8faf7] p-4">
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
        <div className="text-sm font-bold text-[#203525]">
          Rating: {ratingScore}
        </div>
      </div>

      <div className={`mt-4 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <VoteButton
          count={sweetTomatoesCount}
          isActive={userVote === "sweet_tomato"}
          isDisabled={!isLoggedIn}
          isPending={pendingVote === "sweet_tomato"}
          label="Sweet Tomatoes"
          onClick={() => submitVote("sweet_tomato")}
        />
        <VoteButton
          count={bitterCucumbersCount}
          isActive={userVote === "bitter_cucumber"}
          isDisabled={!isLoggedIn}
          isPending={pendingVote === "bitter_cucumber"}
          label="Bitter Cucumbers"
          onClick={() => submitVote("bitter_cucumber")}
        />
      </div>

      {error ? (
        <p className="mt-3 text-sm font-semibold text-[#8a2d1c]">{error}</p>
      ) : null}

      {!isLoggedIn ? (
        <p className="mt-3 text-sm text-[#59655c]">
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
  isActive,
  isDisabled,
  isPending,
  label,
  onClick,
}: {
  count: number;
  isActive: boolean;
  isDisabled: boolean;
  isPending: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={isDisabled || isPending}
      onClick={onClick}
      className={`flex min-h-16 items-center justify-between rounded-md border px-4 py-3 text-left transition ${
        isActive
          ? "border-[#2f6f3e] bg-[#e7f2df] text-[#16351f]"
          : "border-[#c9d8c8] bg-white text-[#203525] hover:bg-[#f1f7ed]"
      } disabled:cursor-not-allowed disabled:opacity-70`}
    >
      <span>
        <span className="block text-sm font-black">{label}</span>
        <span className="mt-1 block text-xs font-bold uppercase tracking-[0.12em] text-[#59655c]">
          {isActive ? "Your vote" : "Vote"}
        </span>
      </span>
      <span className="text-2xl font-black">{isPending ? "..." : count}</span>
    </button>
  );
}

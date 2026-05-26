import { Link } from "expo-router";
import Head from "expo-router/head";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { DashboardHeader } from "../components/dashboard";
import { getApiBaseUrl, useAuth } from "../lib/auth";

type VoteType = "sweet_tomato" | "bitter_cucumber";

type HackListItem = {
  id: number;
  title: string;
  excerpt: string | null;
  difficulty: "easy" | "medium" | "hard";
  ratingScore: number;
  likesCount: number;
  commentsCount: number;
  sweetTomatoesCount: number;
  bitterCucumbersCount: number;
  userVote: VoteType | null;
  group: {
    title: string;
  };
  category: {
    title: string;
  };
};

export default function HacksScreen() {
  return (
    <>
      <Head>
        <title>Garden Hacks | Garden Hacks</title>
      </Head>

      <HacksContent />
    </>
  );
}

export function HacksContent() {
  const { token, user } = useAuth();
  const [hacks, setHacks] = useState<HackListItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [voteError, setVoteError] = useState("");
  const [pendingVoteKey, setPendingVoteKey] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadHacks() {
      setError("");
      setIsLoading(true);

      try {
        const response = await fetch(
          `${getApiBaseUrl()}/hacks?page=1&pageSize=20&sort=top`,
          {
            headers: token
              ? {
                Authorization: `Bearer ${token}`,
              }
              : undefined,
          },
        );

        if (!response.ok) {
          throw new Error("Unable to load hacks.");
        }

        const data = (await response.json()) as { hacks: HackListItem[] };

        if (isActive) {
          setHacks(data.hacks);
        }
      } catch {
        if (isActive) {
          setError(
            "Unable to load hacks. Make sure the Garden Hacks API is running.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadHacks();

    return () => {
      isActive = false;
    };
  }, [token]);

  async function handleVote(hackId: number, voteType: VoteType) {
    if (!token) {
      setVoteError("Log in to vote.");
      return;
    }

    setVoteError("");
    setPendingVoteKey(`${hackId}-${voteType}`);

    try {
      const response = await fetch(`${getApiBaseUrl()}/hacks/${hackId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ voteType }),
      });

      if (!response.ok) {
        throw new Error("Unable to save your vote.");
      }

      const data = (await response.json()) as {
        userVote: VoteType;
        sweetTomatoesCount: number;
        bitterCucumbersCount: number;
        ratingScore: number;
      };

      setHacks((currentHacks) =>
        currentHacks.map((hack) =>
          hack.id === hackId
            ? {
                ...hack,
                userVote: data.userVote,
                sweetTomatoesCount: data.sweetTomatoesCount,
                bitterCucumbersCount: data.bitterCucumbersCount,
                ratingScore: data.ratingScore,
              }
            : hack,
        ),
      );
    } catch (voteSubmitError) {
      setVoteError(
        voteSubmitError instanceof Error
          ? voteSubmitError.message
          : "Unable to save your vote.",
      );
    } finally {
      setPendingVoteKey(null);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? <DashboardHeader title="Garden Hacks" /> : null}
      <Text style={styles.title}>Garden Hacks</Text>

      <View style={styles.menu}>
        {user ? (
          <>
            <Link href="/saved-hacks" asChild>
              <Pressable style={styles.menuLink}>
                <Text style={styles.menuLinkText}>Saved Hacks</Text>
              </Pressable>
            </Link>

            <Text style={styles.menuSeparator}>|</Text>

            <Link href="/add-new-hack" asChild>
              <Pressable style={styles.menuLink}>
                <Text style={styles.menuLinkText}>Add New Hack</Text>
              </Pressable>
            </Link>
          </>
        ) : (
          <Text style={styles.message}>
            Log in to vote.
          </Text>
        )}
      </View>

      {isLoading ? <Text style={styles.message}>Loading hacks...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {voteError ? <Text style={styles.error}>{voteError}</Text> : null}

      {!isLoading && !error && hacks.length === 0 ? (
        <Text style={styles.message}>No published hacks yet.</Text>
      ) : null}

      <View style={styles.list}>
        {hacks.map((hack) => (
          <View style={styles.hackItem} key={hack.id}>
            <Link
              asChild
              href={{
                pathname: "/hack-details",
                params: { id: String(hack.id) },
              }}
            >
              <Pressable>
              <Text style={styles.hackTitle}>{hack.title}</Text>
              <Text style={styles.hackMeta}>
                {hack.group.title} | {hack.category.title} | {hack.difficulty}
              </Text>
              {hack.excerpt ? (
                <Text style={styles.excerpt}>{hack.excerpt}</Text>
              ) : null}
              <Text style={styles.hackStats}>
                Rating {hack.ratingScore} | {hack.likesCount} likes |{" "}
                {hack.commentsCount} comments
              </Text>
              </Pressable>
            </Link>
            <View style={styles.voteActions}>
              <VoteButton
                canVote={Boolean(token)}
                count={hack.sweetTomatoesCount}
                isActive={hack.userVote === "sweet_tomato"}
                isPending={pendingVoteKey === `${hack.id}-sweet_tomato`}
                label="Sweet Tomatoes"
                onPress={() => handleVote(hack.id, "sweet_tomato")}
              />
              <VoteButton
                canVote={Boolean(token)}
                count={hack.bitterCucumbersCount}
                isActive={hack.userVote === "bitter_cucumber"}
                isPending={pendingVoteKey === `${hack.id}-bitter_cucumber`}
                label="Bitter Cucumbers"
                onPress={() => handleVote(hack.id, "bitter_cucumber")}
              />
            </View>
          </View>
        ))}
      </View>

      <Link href="/" asChild>
        <Pressable style={styles.homeButton}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

function VoteButton({
  canVote,
  count,
  isActive,
  isPending,
  label,
  onPress,
}: {
  canVote: boolean;
  count: number;
  isActive: boolean;
  isPending: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      disabled={!canVote || isPending}
      onPress={onPress}
      style={({ pressed }) => [
        styles.voteButton,
        isActive && styles.voteButtonActive,
        (pressed || isPending) && styles.buttonPressed,
      ]}
    >
      <View style={styles.voteButtonText}>
        <Text style={styles.voteButtonLabel}>{label}</Text>
        <Text style={styles.voteButtonStatus}>
          {isActive ? "Your vote" : "Vote"}
        </Text>
      </View>
      <Text style={styles.voteButtonCount}>{isPending ? "..." : count}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonPressed: {
    opacity: 0.72,
  },
  container: {
    gap: 16,
    padding: 24,
  },
  error: {
    color: "#a32626",
    fontSize: 15,
    fontWeight: "700",
  },
  excerpt: {
    color: "#3f5142",
    fontSize: 15,
    lineHeight: 21,
  },
  hackItem: {
    backgroundColor: "#ffffff",
    borderColor: "#c9d8c8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  hackMeta: {
    color: "#526356",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  hackStats: {
    color: "#1f4d2e",
    fontSize: 13,
    fontWeight: "700",
  },
  hackTitle: {
    color: "#16351f",
    fontSize: 19,
    fontWeight: "800",
    lineHeight: 25,
  },
  homeButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderColor: "#1f6b3a",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  homeButtonText: {
    color: "#1f6b3a",
    fontSize: 16,
    fontWeight: "700",
  },
  list: {
    gap: 12,
  },
  menu: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  menuLink: {
    paddingVertical: 4,
  },
  menuLinkText: {
    color: "#1f6b3a",
    fontSize: 15,
    fontWeight: "800",
  },
  menuSeparator: {
    color: "#7a897d",
    fontSize: 15,
    fontWeight: "700",
  },
  message: {
    color: "#3f5142",
    fontSize: 16,
  },
  title: {
    color: "#16351f",
    fontSize: 28,
    fontWeight: "800",
  },
  voteActions: {
    gap: 10,
    marginTop: 4,
  },
  voteButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#c9d8c8",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 62,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  voteButtonActive: {
    backgroundColor: "#e7f2df",
    borderColor: "#2f6f3e",
  },
  voteButtonCount: {
    color: "#18231c",
    fontSize: 22,
    fontWeight: "900",
  },
  voteButtonLabel: {
    color: "#203525",
    fontSize: 14,
    fontWeight: "900",
  },
  voteButtonStatus: {
    color: "#59655c",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  voteButtonText: {
    flex: 1,
    gap: 3,
  },
});

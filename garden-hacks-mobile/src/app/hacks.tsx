import { Link } from "expo-router";
import Head from "expo-router/head";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { DashboardHeader } from "../components/dashboard";
import {
  GardenBadge,
  GardenButton,
  GardenCard,
  HackVisual,
  SectionHeader,
  StateNotice,
  VoteButton,
  gardenTheme,
} from "../components/garden-ui";
import { getApiBaseUrl, useAuth } from "../lib/auth";

type VoteType = "sweet_tomato" | "bitter_cucumber";

type HackListItem = {
  id: number;
  title: string;
  excerpt: string | null;
  imageUrl?: string | null;
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

      <View style={styles.hero}>
        <SectionHeader
          copy="Browse practical ideas from the Garden Hacks community."
          eyebrow="Explore"
          title="Garden Hacks"
        />
        <View style={styles.menu}>
          {user ? (
            <>
              <Link href="/saved-hacks" asChild>
                <GardenButton variant="secondary">Saved Hacks</GardenButton>
              </Link>
              <Link href="/add-new-hack" asChild>
                <GardenButton>Add Hack</GardenButton>
              </Link>
            </>
          ) : (
            <Text style={styles.message}>Log in to vote and save ideas.</Text>
          )}
        </View>
      </View>

      {isLoading ? <StateNotice tone="loading" title="Loading hacks..." /> : null}
      {error ? <StateNotice tone="error" title={error} /> : null}
      {voteError ? <StateNotice tone="error" title={voteError} /> : null}

      {!isLoading && !error && hacks.length === 0 ? (
        <StateNotice title="No published hacks yet" />
      ) : null}

      <View style={styles.list}>
        {hacks.map((hack) => (
          <GardenCard style={styles.hackItem} key={hack.id}>
            <Link
              asChild
              href={{
                pathname: "/hack-details",
                params: { id: String(hack.id) },
              }}
            >
              <Pressable style={({ pressed }) => pressed && styles.pressed}>
                <HackVisual imageUrl={hack.imageUrl} title={hack.title} />
                <View style={styles.cardContent}>
                  <View style={styles.badges}>
                    <GardenBadge tone="mint">{hack.category.title}</GardenBadge>
                    <GardenBadge tone="cream">{hack.difficulty}</GardenBadge>
                  </View>
                  <Text style={styles.hackTitle}>{hack.title}</Text>
                  <Text style={styles.hackMeta}>{hack.group.title}</Text>
                  {hack.excerpt ? (
                    <Text style={styles.excerpt}>{hack.excerpt}</Text>
                  ) : null}
                  <View style={styles.statsRow}>
                    <Text style={styles.statText}>Rating {hack.ratingScore}</Text>
                    <Text style={styles.statText}>{hack.commentsCount} comments</Text>
                  </View>
                </View>
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
                type="positive"
              />
              <VoteButton
                canVote={Boolean(token)}
                count={hack.bitterCucumbersCount}
                isActive={hack.userVote === "bitter_cucumber"}
                isPending={pendingVoteKey === `${hack.id}-bitter_cucumber`}
                label="Bitter Cucumbers"
                onPress={() => handleVote(hack.id, "bitter_cucumber")}
                type="negative"
              />
            </View>
          </GardenCard>
        ))}
      </View>

      <Link href="/" asChild>
        <GardenButton variant="secondary">Back to Home</GardenButton>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cardContent: {
    gap: 9,
    marginTop: 14,
  },
  container: {
    gap: 16,
    padding: 20,
  },
  excerpt: {
    color: gardenTheme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  hackItem: {
    padding: 14,
  },
  hackMeta: {
    color: gardenTheme.colors.primaryDark,
    fontSize: 13,
    fontWeight: "800",
  },
  hackTitle: {
    color: gardenTheme.colors.text,
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 27,
  },
  hero: {
    backgroundColor: "#ffffff",
    borderColor: gardenTheme.colors.border,
    borderRadius: 26,
    borderWidth: 1,
    gap: 14,
    padding: 18,
    ...gardenTheme.shadow,
  },
  list: {
    gap: 14,
  },
  menu: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  message: {
    color: gardenTheme.colors.muted,
    fontSize: 15,
    lineHeight: 21,
  },
  pressed: {
    opacity: 0.74,
  },
  statText: {
    color: gardenTheme.colors.leaf,
    fontSize: 13,
    fontWeight: "900",
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  voteActions: {
    gap: 10,
    marginTop: 2,
  },
});

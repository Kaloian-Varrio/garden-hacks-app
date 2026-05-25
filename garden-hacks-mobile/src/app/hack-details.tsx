import { Link, useLocalSearchParams } from "expo-router";
import Head from "expo-router/head";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getApiBaseUrl, RequireAuth, useAuth } from "../lib/auth";

type HackDetail = {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  difficulty: "easy" | "medium" | "hard";
  isOrganic: boolean;
  isChemicalFree: boolean;
  likesCount: number;
  commentsCount: number;
  sweetTomatoesCount: number;
  bitterCucumbersCount: number;
  ratingScore: number;
  author: {
    name: string;
  };
  group: {
    title: string;
  };
  category: {
    title: string;
  };
};

export default function HackDetailsScreen() {
  return (
    <>
      <Head>
        <title>Garden Hacks | Hack Details</title>
      </Head>

      <RequireAuth>
        <HackDetailsContent />
      </RequireAuth>
    </>
  );
}

function HackDetailsContent() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { token } = useAuth();
  const [hack, setHack] = useState<HackDetail | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(id));

  useEffect(() => {
    let isActive = true;

    async function loadHack() {
      if (!id) {
        setError("Select a hack from the Hacks screen.");
        setIsLoading(false);
        return;
      }

      setError("");
      setIsLoading(true);

      try {
        const response = await fetch(`${getApiBaseUrl()}/hacks/${id}`, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        });

        if (!response.ok) {
          throw new Error("Unable to load hack details.");
        }

        const data = (await response.json()) as { hack: HackDetail };

        if (isActive) {
          setHack(data.hack);
        }
      } catch {
        if (isActive) {
          setError(
            "Unable to load hack details. Make sure the Garden Hacks API is running.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadHack();

    return () => {
      isActive = false;
    };
  }, [id, token]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Link href="/hacks" asChild>
        <Pressable style={styles.backLink}>
          <Text style={styles.backLinkText}>Back to Hacks</Text>
        </Pressable>
      </Link>

      {isLoading ? <Text style={styles.message}>Loading hack...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {hack ? (
        <View style={styles.content}>
          <Text style={styles.title}>{hack.title}</Text>
          <Text style={styles.meta}>
            {hack.group.title} · {hack.category.title} · {hack.difficulty}
          </Text>
          {hack.excerpt ? <Text style={styles.excerpt}>{hack.excerpt}</Text> : null}
          <Text style={styles.body}>{hack.content}</Text>
          <Text style={styles.meta}>By {hack.author.name}</Text>
          <View style={styles.stats}>
            <Text style={styles.stat}>Rating {hack.ratingScore}</Text>
            <Text style={styles.stat}>{hack.likesCount} likes</Text>
            <Text style={styles.stat}>{hack.commentsCount} comments</Text>
            <Text style={styles.stat}>
              {hack.sweetTomatoesCount} sweet tomatoes
            </Text>
            <Text style={styles.stat}>
              {hack.bitterCucumbersCount} bitter cucumbers
            </Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backLink: {
    alignSelf: "flex-start",
    borderColor: "#1f6b3a",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backLinkText: {
    color: "#1f6b3a",
    fontSize: 15,
    fontWeight: "700",
  },
  body: {
    color: "#263c2b",
    fontSize: 16,
    lineHeight: 24,
  },
  container: {
    gap: 18,
    padding: 24,
  },
  content: {
    gap: 14,
  },
  error: {
    color: "#a32626",
    fontSize: 15,
    fontWeight: "700",
  },
  excerpt: {
    color: "#3f5142",
    fontSize: 17,
    lineHeight: 24,
  },
  message: {
    color: "#3f5142",
    fontSize: 16,
  },
  meta: {
    color: "#526356",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  stat: {
    color: "#1f4d2e",
    fontSize: 14,
    fontWeight: "700",
  },
  stats: {
    gap: 7,
  },
  title: {
    color: "#16351f",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
});

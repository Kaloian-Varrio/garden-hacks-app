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
import { DashboardNav } from "../components/dashboard";
import { getApiBaseUrl, RequireAuth, useAuth } from "../lib/auth";

type HackListItem = {
  id: number;
  title: string;
  excerpt: string | null;
  difficulty: "easy" | "medium" | "hard";
  ratingScore: number;
  likesCount: number;
  commentsCount: number;
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

      <RequireAuth>
        <HacksContent />
      </RequireAuth>
    </>
  );
}

function HacksContent() {
  const { token } = useAuth();
  const [hacks, setHacks] = useState<HackListItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DashboardNav />
      <Text style={styles.title}>Garden Hacks</Text>

      <View style={styles.menu}>
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
      </View>

      {isLoading ? <Text style={styles.message}>Loading hacks...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!isLoading && !error && hacks.length === 0 ? (
        <Text style={styles.message}>No published hacks yet.</Text>
      ) : null}

      <View style={styles.list}>
        {hacks.map((hack) => (
          <Link
            asChild
            href={{
              pathname: "/hack-details",
              params: { id: String(hack.id) },
            }}
            key={hack.id}
          >
            <Pressable style={styles.hackItem}>
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

const styles = StyleSheet.create({
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
});

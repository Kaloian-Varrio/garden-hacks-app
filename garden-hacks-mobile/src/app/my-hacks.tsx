import { Link } from "expo-router";
import Head from "expo-router/head";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { DashboardNav } from "../components/dashboard";
import { RequireAuth, useAuth } from "../lib/auth";
import {
  fetchMobileDashboard,
  type MobileDashboard,
} from "../lib/dashboard";

export default function MyHacksScreen() {
  return (
    <>
      <Head>
        <title>Garden Hacks | My Hacks</title>
      </Head>

      <RequireAuth>
        <MyHacksContent />
      </RequireAuth>
    </>
  );
}

function MyHacksContent() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState<MobileDashboard | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadDashboard() {
      if (!token) {
        return;
      }

      try {
        const data = await fetchMobileDashboard(token);

        if (isActive) {
          setDashboard(data);
        }
      } catch {
        if (isActive) {
          setError("Unable to load your hacks.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, [token]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DashboardNav />
      <Text style={styles.title}>My Hacks</Text>
      {isLoading ? <Text style={styles.message}>Loading your hacks...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {dashboard && dashboard.recentUserHacks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No hacks yet</Text>
          <Text style={styles.message}>
            Create your first gardening hack to start earning points.
          </Text>
          <Link href="/add-new-hack" asChild>
            <Pressable style={styles.link}>
              <Text style={styles.linkText}>Create Hack</Text>
            </Pressable>
          </Link>
        </View>
      ) : null}
      <View style={styles.list}>
        {dashboard?.recentUserHacks.map((hack) => (
          <View style={styles.item} key={hack.id}>
            <Text style={styles.itemTitle}>{hack.title}</Text>
            <Text style={styles.meta}>
              {hack.group.title} | {hack.category.title} | {hack.status}
            </Text>
            <Text style={styles.meta}>
              Rating {hack.ratingScore} | {hack.commentsCount ?? 0} comments
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 24,
  },
  emptyState: {
    backgroundColor: "#ffffff",
    borderColor: "#dfe8d8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  emptyTitle: {
    color: "#18231c",
    fontSize: 17,
    fontWeight: "900",
  },
  error: {
    color: "#a32626",
    fontSize: 15,
    fontWeight: "700",
  },
  item: {
    backgroundColor: "#ffffff",
    borderColor: "#dfe8d8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  itemTitle: {
    color: "#16351f",
    fontSize: 18,
    fontWeight: "900",
  },
  link: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#1f6b3a",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  linkText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  list: {
    gap: 12,
  },
  message: {
    color: "#3f5142",
    fontSize: 15,
    lineHeight: 21,
  },
  meta: {
    color: "#59655c",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  title: {
    color: "#16351f",
    fontSize: 28,
    fontWeight: "900",
  },
});

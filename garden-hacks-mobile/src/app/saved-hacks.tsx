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

export default function SavedHacksScreen() {
  return (
    <>
      <Head>
        <title>Garden Hacks | Saved Hacks</title>
      </Head>

      <RequireAuth>
        <SavedHacksContent />
      </RequireAuth>
    </>
  );
}

function SavedHacksContent() {
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
          setError("Unable to load saved hacks.");
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
      <Text style={styles.title}>Saved Hacks</Text>
      {isLoading ? <Text style={styles.message}>Loading saved hacks...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {dashboard && dashboard.savedHacks.length === 0 ? (
        <Text style={styles.message}>You have not saved any hacks yet.</Text>
      ) : null}
      <View style={styles.list}>
        {dashboard?.savedHacks.map((item) => (
          <Link
            asChild
            href={{
              pathname: "/hack-details",
              params: { id: String(item.hack.id) },
            }}
            key={item.id}
          >
            <Pressable style={styles.item}>
              <Text style={styles.itemTitle}>{item.hack.title}</Text>
              <Text style={styles.meta}>
                {item.hack.group.title} | {item.hack.category.title}
              </Text>
              <Text style={styles.meta}>Rating {item.hack.ratingScore}</Text>
            </Pressable>
          </Link>
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
  },
  title: {
    color: "#16351f",
    fontSize: 28,
    fontWeight: "900",
  },
});

import { Link } from "expo-router";
import Head from "expo-router/head";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DashboardHeader } from "../components/dashboard";
import {
  GardenBadge,
  GardenButton,
  GardenCard,
  StateNotice,
  gardenTheme,
} from "../components/garden-ui";
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
      <DashboardHeader title="My Hacks" />
      <Text style={styles.title}>My Hacks</Text>
      {isLoading ? (
        <StateNotice tone="loading" title="Loading your hacks..." />
      ) : null}
      {error ? <StateNotice tone="error" title={error} /> : null}
      {dashboard && dashboard.recentUserHacks.length === 0 ? (
        <StateNotice
          action={
            <Link href="/add-new-hack" asChild>
              <GardenButton>Create Hack</GardenButton>
            </Link>
          }
          copy="Create your first gardening hack to start earning points."
          title="No hacks yet"
        />
      ) : null}
      <View style={styles.list}>
        {dashboard?.recentUserHacks.map((hack) => (
          <GardenCard style={styles.item} key={hack.id}>
            <View style={styles.badges}>
              <GardenBadge tone="sky">{hack.group.title}</GardenBadge>
              <GardenBadge tone="mint">{hack.category.title}</GardenBadge>
              <GardenBadge tone="cream">{hack.status}</GardenBadge>
            </View>
            <Text style={styles.itemTitle}>{hack.title}</Text>
            <Text style={styles.meta}>
              Rating {hack.ratingScore} | {hack.commentsCount ?? 0} comments
            </Text>
          </GardenCard>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  container: {
    gap: 16,
    padding: 20,
  },
  item: {
    gap: 8,
  },
  itemTitle: {
    color: gardenTheme.colors.text,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 25,
  },
  list: {
    gap: 12,
  },
  meta: {
    color: gardenTheme.colors.leaf,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  title: {
    color: gardenTheme.colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
});

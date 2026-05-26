import { Link } from "expo-router";
import Head from "expo-router/head";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { DashboardHeader } from "../components/dashboard";
import {
  GardenBadge,
  GardenCard,
  HackVisual,
  StateNotice,
  gardenTheme,
} from "../components/garden-ui";
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
      <DashboardHeader title="Saved Hacks" />
      <Text style={styles.title}>Saved Hacks</Text>
      {isLoading ? (
        <StateNotice tone="loading" title="Loading saved hacks..." />
      ) : null}
      {error ? <StateNotice tone="error" title={error} /> : null}
      {dashboard && dashboard.savedHacks.length === 0 ? (
        <StateNotice
          copy="Save useful ideas from the hack list and they will appear here."
          title="You have not saved any hacks yet"
        />
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
            <Pressable style={({ pressed }) => [pressed && styles.pressed]}>
              <GardenCard style={styles.item}>
                <HackVisual imageUrl={item.hack.imageUrl} title={item.hack.title} />
                <View style={styles.badges}>
                  <GardenBadge tone="sky">{item.hack.group.title}</GardenBadge>
                  <GardenBadge tone="mint">{item.hack.category.title}</GardenBadge>
                </View>
              <Text style={styles.itemTitle}>{item.hack.title}</Text>
              <Text style={styles.meta}>Rating {item.hack.ratingScore}</Text>
              </GardenCard>
            </Pressable>
          </Link>
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
  },
  pressed: {
    opacity: 0.74,
  },
  title: {
    color: gardenTheme.colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
});

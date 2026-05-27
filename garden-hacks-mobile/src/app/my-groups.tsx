import Head from "expo-router/head";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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

export default function MyGroupsScreen() {
  return (
    <>
      <Head>
        <title>Garden Hacks | My Groups</title>
      </Head>

      <RequireAuth>
        <MyGroupsContent />
      </RequireAuth>
    </>
  );
}

function MyGroupsContent() {
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
          setError("Unable to load your groups.");
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
      <DashboardHeader title="My Groups" />
      <Text style={styles.title}>My Groups</Text>
      {isLoading ? <StateNotice tone="loading" title="Loading groups..." /> : null}
      {error ? <StateNotice tone="error" title={error} /> : null}
      {dashboard && dashboard.joinedGroups.length === 0 ? (
        <StateNotice title="You have not joined any groups yet" />
      ) : null}
      <View style={styles.list}>
        {dashboard?.joinedGroups.map((group) => (
          <GardenCard style={styles.item} key={group.membershipId}>
            <HackVisual imageUrl={group.imageUrl} title={group.title} />
            <View style={styles.badges}>
              <GardenBadge tone="mint">{group.groupRole}</GardenBadge>
              <GardenBadge tone="sky">{group.membersCount} members</GardenBadge>
              <GardenBadge tone="cream">{group.hacksCount} hacks</GardenBadge>
            </View>
            <Text style={styles.itemTitle}>{group.title}</Text>
            {group.description ? (
              <Text style={styles.message}>{group.description}</Text>
            ) : null}
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
  },
  list: {
    gap: 12,
  },
  message: {
    color: gardenTheme.colors.muted,
    fontSize: 15,
    lineHeight: 21,
  },
  title: {
    color: gardenTheme.colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
});

import Head from "expo-router/head";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DashboardHeader } from "../components/dashboard";
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
      {isLoading ? <Text style={styles.message}>Loading groups...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {dashboard && dashboard.joinedGroups.length === 0 ? (
        <Text style={styles.message}>You have not joined any groups yet.</Text>
      ) : null}
      <View style={styles.list}>
        {dashboard?.joinedGroups.map((group) => (
          <View style={styles.item} key={group.membershipId}>
            <Text style={styles.itemTitle}>{group.title}</Text>
            <Text style={styles.meta}>
              {group.groupRole} | {group.membersCount} members | {group.hacksCount} hacks
            </Text>
            {group.description ? (
              <Text style={styles.message}>{group.description}</Text>
            ) : null}
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
    textTransform: "capitalize",
  },
  title: {
    color: "#16351f",
    fontSize: 28,
    fontWeight: "900",
  },
});

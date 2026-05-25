import { Link } from "expo-router";
import Head from "expo-router/head";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { DashboardHeader } from "../components/dashboard";
import { useAuth } from "../lib/auth";

import { HacksContent } from "./hacks";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <>
      <Head>
        <title>Garden Hacks | Home</title>
      </Head>

      {user ? (
        <HacksContent />
      ) : (
        <View style={styles.guestContainer}>
          <View style={styles.content}>
            <Text style={styles.eyebrow}>Garden Hacks</Text>
            <Text style={styles.title}>Welcome to Garden Hacks</Text>
            <Text style={styles.copy}>
              Grow healthier food with practical, sustainable gardening ideas.
            </Text>

            <Link href="/login" asChild>
              <Pressable style={styles.primaryLink}>
                <Text style={styles.primaryLinkText}>Login</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  activityItem: {
    backgroundColor: "#f8faf7",
    borderColor: "#edf2e8",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    padding: 14,
  },
  activityMeta: {
    color: "#59655c",
    fontSize: 13,
    lineHeight: 18,
  },
  activityText: {
    flex: 1,
    gap: 4,
  },
  activityTitle: {
    color: "#18231c",
    fontSize: 15,
    fontWeight: "800",
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#edf5e9",
    borderColor: "#dfe8d8",
    borderRadius: 8,
    borderWidth: 1,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  avatarText: {
    color: "#2f6f3e",
    fontSize: 22,
    fontWeight: "900",
  },
  content: {
    gap: 18,
  },
  copy: {
    color: "#3f5142",
    fontSize: 17,
    lineHeight: 24,
  },
  dashboardContainer: {
    gap: 16,
    padding: 24,
  },
  dashboardTitle: {
    color: "#18231c",
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
  },
  email: {
    color: "#59655c",
    fontSize: 14,
  },
  emptyCopy: {
    color: "#59655c",
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    backgroundColor: "#f8faf7",
    borderColor: "#edf2e8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  emptyTitle: {
    color: "#18231c",
    fontSize: 16,
    fontWeight: "800",
  },
  error: {
    color: "#a32626",
    fontSize: 15,
    fontWeight: "700",
  },
  eyebrow: {
    color: "#4f7f40",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  guestContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  list: {
    gap: 10,
  },
  message: {
    color: "#3f5142",
    fontSize: 16,
  },
  points: {
    color: "#2f6f3e",
    fontSize: 18,
    fontWeight: "900",
  },
  primaryLink: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#1f6b3a",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryLinkText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryLink: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderColor: "#1f6b3a",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  secondaryLinkText: {
    color: "#1f6b3a",
    fontSize: 15,
    fontWeight: "800",
  },
  section: {
    backgroundColor: "#ffffff",
    borderColor: "#dfe8d8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
    padding: 16,
  },
  sectionCopy: {
    color: "#59655c",
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeader: {
    gap: 12,
  },
  sectionTitle: {
    color: "#18231c",
    fontSize: 22,
    fontWeight: "900",
  },
  statsGrid: {
    gap: 12,
  },
  title: {
    color: "#16351f",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
  },
  userPanel: {
    backgroundColor: "#ffffff",
    borderColor: "#dfe8d8",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    padding: 16,
  },
  userText: {
    flex: 1,
    gap: 6,
  },
});

import { Link } from "expo-router";
import Head from "expo-router/head";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { DashboardHeader, DashboardStatCard } from "../components/dashboard";
import {
  BrandLogo,
  GardenBadge,
  GardenButton,
  GardenCard,
  HackVisual,
  SectionHeader,
  StateNotice,
  gardenTheme,
} from "../components/garden-ui";
import { useAuth } from "../lib/auth";
import {
  fetchMobileDashboard,
  formatActivityReason,
  type MobileDashboard,
} from "../lib/dashboard";

export default function HomeScreen() {
  const { token, user } = useAuth();
  const [dashboard, setDashboard] = useState<MobileDashboard | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadDashboard() {
      if (!token) {
        setDashboard(null);
        setError("");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const data = await fetchMobileDashboard(token);

        if (isActive) {
          setDashboard(data);
        }
      } catch {
        if (isActive) {
          setError("Unable to load dashboard. Make sure the API is running.");
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
    <>
      <Head>
        <title>Garden Hacks | Home</title>
      </Head>

      {user ? (
        <ScrollView contentContainerStyle={styles.dashboardContainer}>
          <DashboardHeader title="Overview" />

          <GardenCard style={styles.userPanel}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userText}>
              <Text style={styles.eyebrow}>Dashboard overview</Text>
              <Text style={styles.dashboardTitle}>Welcome, {user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </GardenCard>

          {isLoading ? (
            <StateNotice tone="loading" title="Loading dashboard..." />
          ) : null}
          {error ? <StateNotice tone="error" title={error} /> : null}

          {dashboard ? (
            <>
              <View style={styles.statsGrid}>
                <DashboardStatCard
                  label="Points balance"
                  value={dashboard.pointsBalance}
                />
                <DashboardStatCard
                  label="Published hacks"
                  value={dashboard.publishedHacksCount}
                />
                <DashboardStatCard
                  label="Joined groups"
                  value={dashboard.joinedGroupsCount}
                />
                <DashboardStatCard
                  label="Saved hacks"
                  value={dashboard.savedHacksCount}
                />
              </View>

              <GardenCard style={styles.section}>
                <View style={styles.sectionHeader}>
                  <SectionHeader
                    copy="Points earned from publishing and community reactions."
                    title="Recent activity"
                  />

                  <Link href="/add-new-hack" asChild>
                    <GardenButton>Create Hack</GardenButton>
                  </Link>
                </View>

                {dashboard.recentActivity.length > 0 ? (
                  <View style={styles.list}>
                    {dashboard.recentActivity.map((item) => (
                      <GardenCard style={styles.activityItem} key={item.id}>
                        <View style={styles.activityText}>
                          <Text style={styles.activityTitle}>
                            {formatActivityReason(item.reason)}
                          </Text>
                          <Text style={styles.activityMeta}>
                            {item.hackTitle ?? "Account activity"}
                          </Text>
                        </View>
                        <Text style={styles.points}>+{item.points}</Text>
                      </GardenCard>
                    ))}
                  </View>
                ) : (
                  <StateNotice
                    action={
                      <Link href="/add-new-hack" asChild>
                        <GardenButton>Create Hack</GardenButton>
                      </Link>
                    }
                    copy="Publish your first gardening hack to start earning points."
                    title="No activity yet"
                  />
                )}
              </GardenCard>
            </>
          ) : null}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.guestContainer}>
          <View style={styles.heroCard}>
            <BrandLogo />
            <HackVisual size="hero" title="Garden Hacks" />
            <View style={styles.content}>
              <GardenBadge tone="sky">Smart garden ideas</GardenBadge>
              <Text style={styles.title}>Grow more with clever garden hacks</Text>
              <Text style={styles.copy}>
                Practical, sustainable, low-fuss ideas for healthier vegetables,
                calmer weekends, and happier garden beds.
              </Text>
            </View>
            <View style={styles.heroActions}>
              <Link href="/hacks" asChild>
                <GardenButton>Browse Hacks</GardenButton>
              </Link>
              <Link href="/login" asChild>
                <GardenButton variant="secondary">Login</GardenButton>
              </Link>
            </View>
            <Link href="/register" asChild>
              <Pressable style={styles.registerPrompt}>
                <Text style={styles.registerPromptText}>
                  New here? Create a free account.
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  activityItem: {
    borderRadius: 18,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    padding: 14,
  },
  activityMeta: {
    color: gardenTheme.colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  activityText: {
    flex: 1,
    gap: 4,
  },
  activityTitle: {
    color: gardenTheme.colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  avatar: {
    alignItems: "center",
    backgroundColor: gardenTheme.colors.mint,
    borderColor: "#b7e7d1",
    borderRadius: 20,
    borderWidth: 1,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  avatarText: {
    color: gardenTheme.colors.leaf,
    fontSize: 22,
    fontWeight: "900",
  },
  content: {
    gap: 12,
  },
  copy: {
    color: gardenTheme.colors.muted,
    fontSize: 17,
    lineHeight: 25,
  },
  dashboardContainer: {
    gap: 16,
    padding: 20,
  },
  dashboardTitle: {
    color: gardenTheme.colors.text,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
  },
  email: {
    color: gardenTheme.colors.muted,
    fontSize: 14,
  },
  eyebrow: {
    color: gardenTheme.colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  guestContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  heroCard: {
    backgroundColor: "#ffffff",
    borderColor: gardenTheme.colors.border,
    borderRadius: 28,
    borderWidth: 1,
    gap: 18,
    padding: 18,
    ...gardenTheme.shadow,
  },
  list: {
    gap: 10,
  },
  points: {
    color: gardenTheme.colors.leaf,
    fontSize: 18,
    fontWeight: "900",
  },
  registerPrompt: {
    alignItems: "center",
    paddingVertical: 6,
  },
  registerPromptText: {
    color: gardenTheme.colors.primaryDark,
    fontSize: 15,
    fontWeight: "800",
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    gap: 12,
  },
  statsGrid: {
    gap: 12,
  },
  title: {
    color: gardenTheme.colors.text,
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 42,
  },
  userPanel: {
    flexDirection: "row",
    gap: 14,
  },
  userText: {
    flex: 1,
    gap: 6,
  },
});

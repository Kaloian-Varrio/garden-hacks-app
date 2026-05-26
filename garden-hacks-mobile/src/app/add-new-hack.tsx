import { Link } from "expo-router";
import Head from "expo-router/head";
import { StyleSheet, Text, View } from "react-native";
import { DashboardHeader } from "../components/dashboard";
import {
  GardenButton,
  GardenCard,
  HackVisual,
  gardenTheme,
} from "../components/garden-ui";
import { RequireAuth } from "../lib/auth";

export default function AddNewHackScreen() {
  return (
    <>
      <Head>
        <title>Garden Hacks | Add New Hack</title>
      </Head>

      <RequireAuth>
        <View style={styles.container}>
          <DashboardHeader title="Create Hack" />
          <GardenCard style={styles.card}>
            <HackVisual title="Add New Hack" />
            <Text style={styles.title}>Add New Hack</Text>
            <Text style={styles.copy}>
              Create and manage full hack drafts from the web app. This mobile
              screen keeps the path ready for a compact creation flow.
            </Text>

            <Link href="/hacks" asChild>
              <GardenButton variant="secondary">Back to Garden Hacks</GardenButton>
            </Link>
          </GardenCard>
        </View>
      </RequireAuth>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    gap: 14,
  },
  copy: {
    color: gardenTheme.colors.muted,
    fontSize: 16,
    lineHeight: 23,
  },
  title: {
    color: gardenTheme.colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
});

import { Link } from "expo-router";
import Head from "expo-router/head";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { RequireAuth } from "../lib/auth";

export default function FavoriteHacksScreen() {
  return (
    <>
      <Head>
        <title>Garden Hacks | My Favorite Hacks</title>
      </Head>

      <RequireAuth>
        <View style={styles.container}>
          <Text style={styles.title}>My Favorite Hacks</Text>
          <Text style={styles.copy}>Saved garden hacks will appear here.</Text>

          <Link href="/hacks" asChild>
            <Pressable style={styles.link}>
              <Text style={styles.linkText}>Back to Garden Hacks</Text>
            </Pressable>
          </Link>
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
    padding: 24,
  },
  copy: {
    color: "#3f5142",
    fontSize: 16,
    lineHeight: 23,
  },
  link: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderColor: "#1f6b3a",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  linkText: {
    color: "#1f6b3a",
    fontSize: 15,
    fontWeight: "700",
  },
  title: {
    color: "#16351f",
    fontSize: 28,
    fontWeight: "800",
  },
});

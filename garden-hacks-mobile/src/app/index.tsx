import { Link } from "expo-router";
import Head from "expo-router/head";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <>
      <Head>
        <title>Garden Hacks | Home</title>
      </Head>

      <View style={styles.container}>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  content: {
    gap: 18,
  },
  eyebrow: {
    color: "#44624a",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: "#16351f",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
  },
  copy: {
    color: "#3f5142",
    fontSize: 17,
    lineHeight: 24,
  },
  primaryLink: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#1f6b3a",
    borderRadius: 8,
    marginTop: 10,
    minWidth: 120,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  primaryLinkText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});

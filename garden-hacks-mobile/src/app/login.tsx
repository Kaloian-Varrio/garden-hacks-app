import { Link } from "expo-router";
import Head from "expo-router/head";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  return (
    <>
      <Head>
        <title>Garden Hacks | Login</title>
      </Head>

      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.actions}>
          <Link href="/" asChild>
            <Pressable style={styles.secondaryLink}>
              <Text style={styles.secondaryLinkText}>Back to Home</Text>
            </Pressable>
          </Link>

          <Link href="/hacks" asChild>
            <Pressable style={styles.primaryLink}>
              <Text style={styles.primaryLinkText}>Go to Hacks</Text>
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
  title: {
    color: "#16351f",
    fontSize: 28,
    fontWeight: "800",
  },
  actions: {
    alignItems: "flex-start",
    gap: 12,
    marginTop: 24,
  },
  primaryLink: {
    alignItems: "center",
    backgroundColor: "#1f6b3a",
    borderRadius: 8,
    minWidth: 140,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryLinkText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryLink: {
    alignItems: "center",
    borderColor: "#1f6b3a",
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 140,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  secondaryLinkText: {
    color: "#1f6b3a",
    fontSize: 16,
    fontWeight: "700",
  },
});

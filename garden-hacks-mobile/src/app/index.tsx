import { Link } from "expo-router";
import Head from "expo-router/head";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../lib/auth";

export default function HomeScreen() {
  const { logout, user } = useAuth();

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

          {user ? (
            <>
              <Text style={styles.sessionText}>Logged in as {user.name}</Text>

              <View style={styles.actions}>
                <Link href="/hacks" asChild>
                  <Pressable style={styles.primaryLink}>
                    <Text style={styles.primaryLinkText}>View Hacks</Text>
                  </Pressable>
                </Link>

                <Pressable onPress={logout} style={styles.secondaryLink}>
                  <Text style={styles.secondaryLinkText}>Logout</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <Link href="/login" asChild>
              <Pressable style={styles.primaryLink}>
                <Text style={styles.primaryLinkText}>Login</Text>
              </Pressable>
            </Link>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: "flex-start",
    gap: 12,
    marginTop: 10,
  },
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
  secondaryLink: {
    alignItems: "center",
    borderColor: "#1f6b3a",
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 120,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  secondaryLinkText: {
    color: "#1f6b3a",
    fontSize: 16,
    fontWeight: "700",
  },
  sessionText: {
    color: "#1f4d2e",
    fontSize: 15,
    fontWeight: "700",
  },
});

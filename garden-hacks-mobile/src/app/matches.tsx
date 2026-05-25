import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MatchesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matches</Text>

      <Link href="/match-details" asChild>
        <Pressable style={styles.link}>
          <Text style={styles.linkText}>Open Match Details</Text>
        </Pressable>
      </Link>
    </View>
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
    marginBottom: 18,
  },
  link: {
    alignSelf: "flex-start",
    borderColor: "#1f6b3a",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  linkText: {
    color: "#1f6b3a",
    fontSize: 16,
    fontWeight: "700",
  },
});

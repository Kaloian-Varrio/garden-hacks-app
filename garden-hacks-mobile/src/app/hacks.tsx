import { StyleSheet, Text, View } from "react-native";

export default function HacksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hacks</Text>
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
  },
});

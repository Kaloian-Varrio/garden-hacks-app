import Head from "expo-router/head";
import { StyleSheet, Text, View } from "react-native";

export default function HackDetailsScreen() {
  return (
    <>
      <Head>
        <title>Garden Hacks | Hack Details</title>
      </Head>

      <View style={styles.container}>
        <Text style={styles.title}>Hack Details</Text>
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
});

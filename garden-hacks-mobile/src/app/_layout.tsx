import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f7faf5",
        },
        headerTintColor: "#16351f",
        headerTitleStyle: {
          fontWeight: "700",
        },
        contentStyle: {
          backgroundColor: "#f7faf5",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="hacks" options={{ title: "Hacks" }} />
      <Stack.Screen name="matches" options={{ title: "Matches" }} />
      <Stack.Screen name="match-details" options={{ title: "Match Details" }} />
    </Stack>
  );
}

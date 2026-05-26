import { Stack } from "expo-router";
import { AuthProvider } from "../lib/auth";
import { gardenTheme } from "../components/garden-ui";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: gardenTheme.colors.background,
          },
          headerShadowVisible: false,
          headerTintColor: gardenTheme.colors.text,
          headerTitleStyle: {
            fontWeight: "900",
          },
          contentStyle: {
            backgroundColor: gardenTheme.colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Garden Hacks" }} />
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="register" options={{ title: "Register" }} />
        <Stack.Screen name="hacks" options={{ title: "Garden Hacks" }} />
        <Stack.Screen name="hack-details" options={{ title: "Hack Details" }} />
        <Stack.Screen name="my-hacks" options={{ title: "My Hacks" }} />
        <Stack.Screen name="saved-hacks" options={{ title: "Saved Hacks" }} />
        <Stack.Screen name="my-groups" options={{ title: "My Groups" }} />
        <Stack.Screen name="add-new-hack" options={{ title: "Add New Hack" }} />
      </Stack>
    </AuthProvider>
  );
}

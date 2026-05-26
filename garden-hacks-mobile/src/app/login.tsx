import { Link, useRouter } from "expo-router";
import Head from "expo-router/head";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  BrandLogo,
  GardenButton,
  GardenCard,
  HackVisual,
  StateNotice,
  gardenTheme,
} from "../components/garden-ui";
import { useAuth } from "../lib/auth";

export default function LoginScreen() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Email and password are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await login({
        email: trimmedEmail,
        password,
      });
      router.replace("/hacks");
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to login. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Garden Hacks | Login</title>
      </Head>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.content}>
          <BrandLogo />
          <HackVisual title="Garden Hacks Login" />
          <View style={styles.heading}>
            <Text style={styles.eyebrow}>Welcome back</Text>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.copy}>
              Sign in to open your garden hacks, saved ideas, and protected app
              screens.
            </Text>
          </View>

          {user ? (
            <StateNotice tone="success" title={`Logged in as ${user.name}`} />
          ) : null}

          <GardenCard style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                editable={!isSubmitting}
                inputMode="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="user@example.com"
                placeholderTextColor="#7a897d"
                style={styles.input}
                value={email}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                autoCapitalize="none"
                editable={!isSubmitting}
                onChangeText={setPassword}
                placeholder="pass1234"
                placeholderTextColor="#7a897d"
                secureTextEntry
                style={styles.input}
                value={password}
              />
            </View>

            {error ? (
              <StateNotice tone="error" title={error} />
            ) : null}

            <GardenButton
              disabled={isSubmitting}
              onPress={handleLogin}
              style={styles.fullButton}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </GardenButton>

            <Link href="/register" asChild>
              <Pressable style={styles.registerLink}>
                <Text style={styles.registerLinkText}>
                  Don&apos;t have an account? Create one here.
                </Text>
              </Pressable>
            </Link>
          </GardenCard>

          <View style={styles.actions}>
            <Link href="/" asChild>
              <GardenButton variant="secondary">Back to Home</GardenButton>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: "flex-start",
    marginTop: 8,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  content: {
    gap: 18,
  },
  copy: {
    color: gardenTheme.colors.muted,
    fontSize: 16,
    lineHeight: 23,
  },
  eyebrow: {
    color: gardenTheme.colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  field: {
    gap: 7,
  },
  form: {
    gap: 14,
  },
  fullButton: {
    alignSelf: "stretch",
  },
  heading: {
    gap: 7,
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: gardenTheme.colors.border,
    borderRadius: 18,
    borderWidth: 1,
    color: gardenTheme.colors.text,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  label: {
    color: gardenTheme.colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  registerLink: {
    alignItems: "center",
    marginTop: 6,
  },
  registerLinkText: {
    color: gardenTheme.colors.primaryDark,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 22,
    textAlign: "center",
  },
  title: {
    color: gardenTheme.colors.text,
    fontSize: 34,
    fontWeight: "900",
  },
});

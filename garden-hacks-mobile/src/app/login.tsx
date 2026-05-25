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
          <Text style={styles.title}>Login</Text>
          <Text style={styles.copy}>
            Sign in to open your garden hacks, saved ideas, and protected app
            screens.
          </Text>

          {user ? (
            <View style={styles.notice}>
              <Text style={styles.noticeText}>Logged in as {user.name}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
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

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              disabled={isSubmitting}
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.primaryButton,
                (pressed || isSubmitting) && styles.buttonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Text>
            </Pressable>

            <Text style={styles.registerHint}>
              Don&apos;t have an account? Register through the web app.
            </Text>
          </View>

          <View style={styles.actions}>
            <Link href="/" asChild>
              <Pressable style={styles.secondaryLink}>
                <Text style={styles.secondaryLinkText}>Back to Home</Text>
              </Pressable>
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
  buttonPressed: {
    opacity: 0.72,
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
    color: "#3f5142",
    fontSize: 16,
    lineHeight: 23,
  },
  error: {
    color: "#a32626",
    fontSize: 14,
    fontWeight: "700",
  },
  field: {
    gap: 7,
  },
  form: {
    gap: 14,
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#c9d8c8",
    borderRadius: 8,
    borderWidth: 1,
    color: "#16351f",
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  label: {
    color: "#263c2b",
    fontSize: 14,
    fontWeight: "700",
  },
  notice: {
    backgroundColor: "#e7f2df",
    borderColor: "#c9d8c8",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  noticeText: {
    color: "#1f4d2e",
    fontSize: 14,
    fontWeight: "700",
  },
  primaryButton: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#1f6b3a",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  registerHint: {
    color: "#6b746d",
    fontSize: 18,
    lineHeight: 26,
    marginTop: 18,
    textAlign: "center",
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
  title: {
    color: "#16351f",
    fontSize: 28,
    fontWeight: "800",
  },
});

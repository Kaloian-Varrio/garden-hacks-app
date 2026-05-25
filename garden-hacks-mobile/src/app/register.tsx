import { Link, useRouter } from "expo-router";
import Head from "expo-router/head";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../lib/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidationErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateForm() {
    const nextErrors: ValidationErrors = {};
    const trimmedEmail = email.trim();

    if (!name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 5) {
      nextErrors.password = "Password must be at least 5 characters.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm Password is required.";
    } else if (password && password !== confirmPassword) {
      nextErrors.confirmPassword = "Password and Confirm Password must match.";
    }

    return nextErrors;
  }

  async function handleRegister() {
    const nextErrors = validateForm();

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      router.replace("/hacks");
    } catch (registerError) {
      setFormError(
        registerError instanceof Error
          ? registerError.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Garden Hacks | Register</title>
      </Head>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.copy}>
            Join Garden Hacks to save ideas and open protected app screens.
          </Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                autoCapitalize="words"
                autoComplete="name"
                editable={!isSubmitting}
                onChangeText={setName}
                placeholder="User Name"
                placeholderTextColor="#7a897d"
                style={styles.input}
                value={name}
              />
              {errors.name ? (
                <Text style={styles.error}>{errors.name}</Text>
              ) : null}
            </View>

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
              {errors.email ? (
                <Text style={styles.error}>{errors.email}</Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                autoCapitalize="none"
                editable={!isSubmitting}
                onChangeText={setPassword}
                placeholder="At least 5 characters"
                placeholderTextColor="#7a897d"
                secureTextEntry
                style={styles.input}
                value={password}
              />
              {errors.password ? (
                <Text style={styles.error}>{errors.password}</Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                autoCapitalize="none"
                editable={!isSubmitting}
                onChangeText={setConfirmPassword}
                placeholder="Repeat password"
                placeholderTextColor="#7a897d"
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
              />
              {errors.confirmPassword ? (
                <Text style={styles.error}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            {formError ? <Text style={styles.error}>{formError}</Text> : null}

            <Pressable
              disabled={isSubmitting}
              onPress={handleRegister}
              style={({ pressed }) => [
                styles.primaryButton,
                (pressed || isSubmitting) && styles.buttonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Text>
            </Pressable>

            <Link href="/login" asChild>
              <Pressable style={styles.loginLink}>
                <Text style={styles.loginLinkText}>
                  Already have an account? Login.
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  buttonPressed: {
    opacity: 0.72,
  },
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 18,
    justifyContent: "center",
    padding: 24,
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
  loginLink: {
    alignItems: "center",
    marginTop: 8,
  },
  loginLinkText: {
    color: "#1f6b3a",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
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
  title: {
    color: "#16351f",
    fontSize: 28,
    fontWeight: "800",
  },
});

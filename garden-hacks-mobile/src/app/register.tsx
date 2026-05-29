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
import {
  BrandLogo,
  GardenButton,
  GardenCard,
  HackVisual,
  StateNotice,
  gardenTheme,
} from "../components/garden-ui";
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
          <BrandLogo />
          <HackVisual title="Garden Hacks Account" />
          <View style={styles.heading}>
            <Text style={styles.eyebrow}>Join the garden</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.copy}>
              Join Garden Hacks to save ideas and open protected app screens.
            </Text>
          </View>

          <GardenCard style={styles.form}>
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

            {formError ? (
              <StateNotice tone="error" title={formError} />
            ) : null}

            <GardenButton
              disabled={isSubmitting}
              onPress={handleRegister}
              style={styles.fullButton}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </GardenButton>

            <Link href="/login" asChild>
              <Pressable style={styles.loginLink}>
                <Text style={styles.loginLinkText}>
                  Already have an account? Login.
                </Text>
              </Pressable>
            </Link>

            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>
                Welcome to the smart gardeners' community.
              </Text>
            </View>
          </GardenCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
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
  error: {
    color: gardenTheme.colors.danger,
    fontSize: 14,
    fontWeight: "800",
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
  loginLink: {
    alignItems: "center",
    marginTop: 8,
  },
  loginLinkText: {
    color: gardenTheme.colors.primaryDark,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  welcomeText: {
    color: gardenTheme.colors.muted,
    fontSize: 15,
    textAlign: "center",
  },
  title: {
    color: gardenTheme.colors.text,
    fontSize: 34,
    fontWeight: "900",
  },
});

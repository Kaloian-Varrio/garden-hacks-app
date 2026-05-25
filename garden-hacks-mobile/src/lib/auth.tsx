import { Redirect } from "expo-router";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const TOKEN_STORAGE_KEY = "garden_hacks_mobile_token";

type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
  pointsBalance: number;
  photoUrl: string | null;
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthContextValue = {
  isReady: boolean;
  token: string | null;
  user: AuthUser | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};

type ErrorResponse = {
  error?: string;
  details?: Record<string, string>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getNetworkErrorMessage() {
  return `Unable to connect to the Garden Hacks API at ${getApiBaseUrl()}. Make sure the Next.js server is running.`;
}

function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("EXPO_PUBLIC_API_BASE_URL is not configured.");
  }

  return API_BASE_URL.replace(/\/$/, "");
}

function getStoredToken() {
  if (Platform.OS !== "web" || typeof localStorage === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function setStoredToken(token: string | null) {
  if (Platform.OS !== "web" || typeof localStorage === "undefined") {
    return;
  }

  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

async function readErrorMessage(response: Response) {
  const data = (await response.json().catch(() => null)) as ErrorResponse | null;

  if (data?.details) {
    const firstDetail = Object.values(data.details)[0];

    if (firstDetail) {
      return firstDetail;
    }
  }

  return data?.error ?? "Something went wrong. Please try again.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setStoredToken(null);
  }, []);

  useEffect(() => {
    const savedToken = getStoredToken();

    if (!savedToken) {
      setIsReady(true);
      return;
    }

    fetch(`${getApiBaseUrl()}/auth/me`, {
      headers: {
        Authorization: `Bearer ${savedToken}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await readErrorMessage(response));
        }

        return response.json() as Promise<{ user: AuthUser }>;
      })
      .then((data) => {
        setToken(savedToken);
        setUser(data.user);
      })
      .catch(() => {
        setStoredToken(null);
      })
      .finally(() => {
        setIsReady(true);
      });
  }, []);

  const login = useCallback(async ({ email, password }: LoginPayload) => {
    let response: Response;

    try {
      response = await fetch(`${getApiBaseUrl()}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
    } catch {
      throw new Error(getNetworkErrorMessage());
    }

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const data = (await response.json()) as {
      token: string;
      user: AuthUser;
    };

    setToken(data.token);
    setUser(data.user);
    setStoredToken(data.token);
  }, []);

  const value = useMemo(
    () => ({
      isReady,
      login,
      logout,
      token,
      user,
    }),
    [isReady, login, logout, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isReady, user } = useAuth();

  if (!isReady) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return children;
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  message: {
    color: "#3f5142",
    fontSize: 16,
  },
});

import { Link } from "expo-router";
import Head from "expo-router/head";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { DashboardHeader } from "../components/dashboard";
import { StateNotice, gardenTheme, GardenCard } from "../components/garden-ui";
import { RequireAuth, useAuth, getApiBaseUrl } from "../lib/auth";

type DashboardUserItem = {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
    pointsBalance: number;
    createdAt: string;
};

export default function AdminUsersScreen() {
    return (
        <>
            <Head>
                <title>Garden Hacks | Users Management</title>
            </Head>

            <RequireAuth>
                <AdminUsersContent />
            </RequireAuth>
        </>
    );
}

function AdminUsersContent() {
    const { token, user } = useAuth();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<{ totalUsers: number; users: DashboardUserItem[] } | null>(null);

    useEffect(() => {
        let isActive = true;

        async function loadUsers() {
            if (!token || user?.role !== "admin") {
                setIsLoading(false);
                return;
            }

            try {
                const res = await fetch(`${getApiBaseUrl()}/mobile/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Unable to load data.");
                const result = await res.json();

                if (isActive) {
                    setData(result);
                }
            } catch {
                if (isActive) {
                    setError("Unable to load users.");
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        loadUsers();

        return () => {
            isActive = false;
        };
    }, [token, user]);

    if (user?.role !== "admin") {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <DashboardHeader title="Users Management" />
                <StateNotice tone="error" title="Only admins can view this page." />
            </ScrollView>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <DashboardHeader title="Users Management" />
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.title}>Users Management</Text>
                    <Text style={styles.subtitle}>
                        Admin-only overview of registered Garden Hacks users.
                    </Text>
                </View>
                <View style={styles.totalBadge}>
                    <Text style={styles.totalText}>
                        Total users: {data?.totalUsers || 0}
                    </Text>
                </View>
            </View>

            {isLoading ? (
                <StateNotice tone="loading" title="Loading users..." />
            ) : null}
            {error ? <StateNotice tone="error" title={error} /> : null}

            <View style={styles.table}>
                {data?.users.map((dashUser) => (
                    <GardenCard key={dashUser.id} style={styles.userCard}>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{dashUser.name}</Text>
                            <Text style={styles.userEmail}>{dashUser.email}</Text>
                            <View style={styles.metaRow}>
                                <View style={styles.roleBadge}>
                                    <Text style={styles.roleText}>{dashUser.role}</Text>
                                </View>
                                <Text style={styles.metaText}>{dashUser.pointsBalance} pts</Text>
                                <Text style={styles.metaText}>
                                    {new Date(dashUser.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.actions}>
                            <Text
                                style={styles.editBtn}
                                onPress={() =>
                                    Alert.alert(
                                        "TODO",
                                        `API support for editing user ${dashUser.id} is not yet implemented.`
                                    )
                                }
                            >
                                Edit
                            </Text>
                            <Text
                                style={styles.deleteBtn}
                                onPress={() =>
                                    Alert.alert(
                                        "Confirm",
                                        "Are you sure you want to delete this user? This cannot be undone.",
                                        [
                                            { text: "Cancel", style: "cancel" },
                                            {
                                                text: "Delete",
                                                style: "destructive",
                                                onPress: () =>
                                                    Alert.alert(
                                                        "TODO",
                                                        `API support for deleting user ${dashUser.id} is not yet implemented.`
                                                    ),
                                            },
                                        ]
                                    )
                                }
                            >
                                Delete
                            </Text>
                        </View>
                    </GardenCard>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 20,
        padding: 20,
        paddingBottom: 60,
    },
    title: {
        color: gardenTheme.colors.primaryDark,
        fontSize: 24,
        fontWeight: "900",
    },
    subtitle: {
        marginTop: 6,
        color: gardenTheme.colors.primaryDark,
        fontSize: 14,
        opacity: 0.8,
    },
    headerRow: {
        flexDirection: "column",
        gap: 12,
    },
    totalBadge: {
        alignSelf: "flex-start",
        backgroundColor: "#e9fbef",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    totalText: {
        color: "#134c40",
        fontSize: 14,
        fontWeight: "900",
    },
    table: {
        gap: 12,
    },
    userCard: {
        flexDirection: "row",
        gap: 12,
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    userInfo: {
        flex: 1,
        gap: 4,
    },
    userName: {
        color: gardenTheme.colors.primaryDark,
        fontSize: 16,
        fontWeight: "bold",
    },
    userEmail: {
        color: gardenTheme.colors.muted,
        fontSize: 14,
    },
    metaRow: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        marginTop: 4,
    },
    roleBadge: {
        backgroundColor: "#eef8fd",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    roleText: {
        color: "#17536a",
        fontSize: 12,
        fontWeight: "900",
    },
    metaText: {
        color: gardenTheme.colors.muted,
        fontSize: 13,
    },
    actions: {
        gap: 8,
    },
    editBtn: {
        borderColor: "#b7c8ad",
        borderRadius: 6,
        borderWidth: 1,
        color: "#203525",
        fontSize: 12,
        fontWeight: "600",
        overflow: "hidden",
        paddingHorizontal: 12,
        paddingVertical: 8,
        textAlign: "center",
    },
    deleteBtn: {
        backgroundColor: "white",
        borderColor: "#ffc2ad",
        borderRadius: 6,
        borderWidth: 1,
        color: "#a33a20",
        fontSize: 12,
        fontWeight: "700",
        overflow: "hidden",
        paddingHorizontal: 12,
        paddingVertical: 8,
        textAlign: "center",
    },
});

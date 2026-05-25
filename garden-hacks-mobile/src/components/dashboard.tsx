import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useAuth } from "../lib/auth";

type DashboardRoute =
  | "/"
  | "/my-hacks"
  | "/add-new-hack"
  | "/saved-hacks"
  | "/my-groups";

const navItems: Array<{ href: DashboardRoute; label: string }> = [
  { href: "/", label: "Overview" },
  { href: "/my-hacks", label: "My Hacks" },
  { href: "/add-new-hack", label: "Create Hack" },
  { href: "/saved-hacks", label: "Saved Hacks" },
  { href: "/my-groups", label: "My Groups" },
];

export function DashboardHeader({ title }: { title: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const { height } = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(false);

  function closeDrawer() {
    setIsOpen(false);
  }

  function navigateTo(href: DashboardRoute) {
    closeDrawer();
    router.push(href);
  }

  function handleLogout() {
    closeDrawer();
    logout();
    router.replace("/");
  }

  return (
    <>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Open dashboard menu"
          onPress={() => setIsOpen(true)}
          style={styles.menuButton}
        >
          <Text style={styles.menuButtonText}>Menu</Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.headerEyebrow}>Dashboard</Text>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </View>

      {isOpen ? (
        <View style={StyleSheet.flatten([styles.drawerRoot, { height }])}>
          <Pressable
            accessibilityLabel="Close dashboard menu"
            onPress={closeDrawer}
            style={styles.backdrop}
          />

          <View style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.drawerTitle}>Garden Hacks</Text>
                {user ? (
                  <Text numberOfLines={1} style={styles.drawerSubtitle}>
                    {user.name}
                  </Text>
                ) : null}
              </View>

              <Pressable
                accessibilityLabel="Close dashboard menu"
                onPress={closeDrawer}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>

            <View style={styles.drawerNav}>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Pressable
                    key={item.href}
                    onPress={() => navigateTo(item.href)}
                    style={StyleSheet.flatten([
                      styles.drawerItem,
                      isActive ? styles.drawerItemActive : null,
                    ])}
                  >
                    <Text
                      style={StyleSheet.flatten([
                        styles.drawerItemText,
                        isActive ? styles.drawerItemTextActive : null,
                      ])}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </>
  );
}

export function DashboardStatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.34)",
  },
  closeButton: {
    alignItems: "center",
    borderColor: "#dfe8d8",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  closeButtonText: {
    color: "#16351f",
    fontSize: 13,
    fontWeight: "800",
  },
  drawer: {
    backgroundColor: "#f7faf5",
    borderBottomRightRadius: 12,
    borderColor: "#dfe8d8",
    borderRightWidth: 1,
    borderTopRightRadius: 12,
    elevation: 8,
    gap: 18,
    height: "100%",
    maxWidth: 340,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    width: "82%",
  },
  drawerHeader: {
    alignItems: "flex-start",
    borderBottomColor: "#dfe8d8",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  drawerItem: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  drawerItemActive: {
    backgroundColor: "#2f6f3e",
  },
  drawerItemText: {
    color: "#405046",
    fontSize: 16,
    fontWeight: "800",
  },
  drawerItemTextActive: {
    color: "#ffffff",
  },
  drawerNav: {
    gap: 8,
  },
  drawerRoot: {
    bottom: 0,
    left: -24,
    position: "absolute",
    right: -24,
    top: -24,
    zIndex: 100,
  },
  drawerSubtitle: {
    color: "#59655c",
    fontSize: 14,
    marginTop: 4,
    maxWidth: 230,
  },
  drawerTitle: {
    color: "#16351f",
    fontSize: 22,
    fontWeight: "900",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  headerEyebrow: {
    color: "#4f7f40",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    color: "#16351f",
    fontSize: 24,
    fontWeight: "900",
  },
  logoutButton: {
    alignItems: "center",
    borderColor: "#1f6b3a",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: "auto",
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  logoutButtonText: {
    color: "#1f6b3a",
    fontSize: 16,
    fontWeight: "800",
  },
  menuButton: {
    alignItems: "center",
    backgroundColor: "#1f6b3a",
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  menuButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  statCard: {
    backgroundColor: "#ffffff",
    borderColor: "#dfe8d8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  statLabel: {
    color: "#59655c",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  statValue: {
    color: "#18231c",
    fontSize: 28,
    fontWeight: "900",
  },
});

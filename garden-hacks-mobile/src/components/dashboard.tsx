import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { BrandLogo, GardenButton, gardenTheme } from "./garden-ui";
import { useAuth } from "../lib/auth";

type DashboardRoute =
  | "/"
  | "/my-hacks"
  | "/add-new-hack"
  | "/saved-hacks"
  | "/my-groups";

const navItems: Array<{ href: DashboardRoute; icon: string; label: string }> = [
  { href: "/", icon: "GH", label: "My Profile" },
  { href: "/my-hacks", icon: "H", label: "My Hacks" },
  { href: "/add-new-hack", icon: "+", label: "Create Hack" },
  { href: "/saved-hacks", icon: "S", label: "Saved Hacks" },
  { href: "/my-groups", icon: "G", label: "My Groups" },
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
          <Text style={styles.headerEyebrow}>Garden dashboard</Text>
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
                <BrandLogo />
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
                    <View
                      style={StyleSheet.flatten([
                        styles.drawerItemIcon,
                        isActive ? styles.drawerItemIconActive : null,
                      ])}
                    >
                      <Text
                        style={StyleSheet.flatten([
                          styles.drawerItemIconText,
                          isActive ? styles.drawerItemIconTextActive : null,
                        ])}
                      >
                        {item.icon}
                      </Text>
                    </View>
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

              {user?.role === "admin" && (
                <Pressable
                  key="/users"
                  onPress={() => navigateTo("/users" as any)}
                  style={StyleSheet.flatten([
                    styles.drawerItem,
                    pathname.startsWith("/users") ? styles.drawerItemActive : null,
                  ])}
                >
                  <View
                    style={StyleSheet.flatten([
                      styles.drawerItemIcon,
                      pathname.startsWith("/users") ? styles.drawerItemIconActive : null,
                    ])}
                  >
                    <Text
                      style={StyleSheet.flatten([
                        styles.drawerItemIconText,
                        pathname.startsWith("/users") ? styles.drawerItemIconTextActive : null,
                      ])}
                    >
                      A
                    </Text>
                  </View>
                  <Text
                    style={StyleSheet.flatten([
                      styles.drawerItemText,
                      pathname.startsWith("/users") ? styles.drawerItemTextActive : null,
                    ])}
                  >
                    Users
                  </Text>
                </Pressable>
              )}
              Logout
            </GardenButton>
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
    backgroundColor: "rgba(11, 37, 29, 0.34)",
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: gardenTheme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  closeButtonText: {
    color: gardenTheme.colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  drawer: {
    backgroundColor: "#f7fffb",
    borderBottomRightRadius: 24,
    borderColor: gardenTheme.colors.border,
    borderRightWidth: 1,
    borderTopRightRadius: 24,
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
    borderBottomColor: gardenTheme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  drawerItem: {
    alignItems: "center",
    borderRadius: 18,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  drawerItemActive: {
    backgroundColor: gardenTheme.colors.primary,
  },
  drawerItemIcon: {
    alignItems: "center",
    backgroundColor: gardenTheme.colors.mint,
    borderRadius: 13,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  drawerItemIconActive: {
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },
  drawerItemIconText: {
    color: gardenTheme.colors.leaf,
    fontSize: 12,
    fontWeight: "900",
  },
  drawerItemIconTextActive: {
    color: "#ffffff",
  },
  drawerItemText: {
    color: "#405046",
    fontSize: 16,
    fontWeight: "900",
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
  header: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.78)",
    borderColor: gardenTheme.colors.border,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 10,
    ...gardenTheme.shadow,
  },
  headerEyebrow: {
    color: gardenTheme.colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    color: gardenTheme.colors.text,
    fontSize: 24,
    fontWeight: "900",
  },
  logoutButton: {
    marginTop: "auto",
  },
  menuButton: {
    alignItems: "center",
    backgroundColor: gardenTheme.colors.primary,
    borderRadius: 999,
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  menuButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  statCard: {
    backgroundColor: gardenTheme.colors.card,
    borderColor: gardenTheme.colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 8,
    padding: 16,
    ...gardenTheme.shadow,
  },
  statLabel: {
    color: gardenTheme.colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  statValue: {
    color: gardenTheme.colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
});

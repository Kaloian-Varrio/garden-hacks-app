import { Link, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const navItems = [
  { href: "/" as const, label: "Overview" },
  { href: "/my-hacks" as const, label: "My Hacks" },
  { href: "/add-new-hack" as const, label: "Create Hack" },
  { href: "/saved-hacks" as const, label: "Saved Hacks" },
  { href: "/my-groups" as const, label: "My Groups" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <View style={styles.nav}>
      {navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link href={item.href} asChild key={item.href}>
            <Pressable
              style={[styles.navItem, isActive ? styles.navItemActive : null]}
            >
              <Text
                style={[
                  styles.navItemText,
                  isActive ? styles.navItemTextActive : null,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
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
  nav: {
    gap: 8,
  },
  navItem: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  navItemActive: {
    backgroundColor: "#2f6f3e",
  },
  navItemText: {
    color: "#405046",
    fontSize: 15,
    fontWeight: "700",
  },
  navItemTextActive: {
    color: "#ffffff",
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

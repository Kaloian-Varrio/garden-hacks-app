import { type ReactNode } from "react";
import { Image } from "expo-image";
import {
  Pressable,
  type PressableProps,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import Svg, {
  Path,
  Rect,
} from "react-native-svg";
import { getApiBaseUrl } from "../lib/auth";

export const gardenTheme = {
  colors: {
    background: "#f6fbf7",
    card: "#ffffff",
    cream: "#fffaf0",
    primary: "#0f9f93",
    primaryDark: "#0f766e",
    leaf: "#176b49",
    mint: "#dff8e9",
    sky: "#e9fbff",
    tomato: "#f0643c",
    tomatoSoft: "#fff0eb",
    cucumber: "#2f9e59",
    cucumberSoft: "#e9fbef",
    text: "#10231c",
    muted: "#59655c",
    border: "#d9eee4",
    danger: "#a33a20",
    dangerSoft: "#fff0eb",
    amber: "#8a5c13",
    amberSoft: "#fff7df",
  },
  radius: {
    sm: 12,
    md: 18,
    lg: 24,
    pill: 999,
  },
  shadow: {
    elevation: 3,
    shadowColor: "#0f3d32",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
};

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.logoRow}>
      <View style={styles.logoMark}>
        <GardenHacksMark />
      </View>
      {!compact ? (
        <View>
          <Text style={styles.logoTitle}>Garden Hacks</Text>
          <Text style={styles.logoSubtitle}>grow smarter</Text>
        </View>
      ) : null}
    </View>
  );
}

function GardenHacksMark({ size = 54 }: { size?: number }) {
  return (
    <Svg accessible={false} height={size} viewBox="0 0 96 96" width={size}>
      <Rect width="96" height="96" rx="24" fill="#087f7d" />
      <Path
        d="M48 81C45.7 68 46.8 57.6 49 48"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="6.2"
      />
      <Path
        d="M48.2 47.5C39.8 36 41.4 24.2 48.4 14.8C55.6 24.5 56.6 36.5 48.2 47.5Z"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6.2"
      />
      <Path
        d="M46.8 48.1C34.9 45.7 27.6 37.7 28.6 27.4C39 27 46.2 35 46.8 48.1Z"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6.2"
      />
      <Path
        d="M49.2 48.1C61.1 45.7 68.4 37.7 67.4 27.4C57 27 49.8 35 49.2 48.1Z"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6.2"
      />
      <Path
        d="M33.8 67.2C41.4 64.6 46.7 57.4 48 48.6C51 57 57.2 64.1 64.7 67.2"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6.2"
      />
    </Svg>
  );
}

export function GardenButton({
  children,
  disabled,
  onPress,
  style,
  textStyle,
  variant = "primary",
  ...pressableProps
}: {
  children: ReactNode;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: ButtonVariant;
} & Omit<PressableProps, "children" | "style">) {
  return (
    <Pressable
      {...pressableProps}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        buttonVariants[variant],
        (pressed || disabled) && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.buttonText, buttonTextVariants[variant], textStyle]}>
        {children}
      </Text>
    </Pressable>
  );
}

export function GardenCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function GardenBadge({
  children,
  tone = "mint",
}: {
  children: ReactNode;
  tone?: "mint" | "sky" | "tomato" | "cream";
}) {
  return (
    <View style={[styles.badge, badgeTones[tone]]}>
      <Text style={[styles.badgeText, badgeTextTones[tone]]}>{children}</Text>
    </View>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  copy,
}: {
  copy?: string;
  eyebrow?: string;
  title: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.sectionTitle}>{title}</Text>
      {copy ? <Text style={styles.sectionCopy}>{copy}</Text> : null}
    </View>
  );
}

export function StateNotice({
  action,
  tone = "empty",
  title,
  copy,
}: {
  action?: ReactNode;
  copy?: string;
  title: string;
  tone?: "empty" | "error" | "loading" | "success";
}) {
  return (
    <View style={[styles.notice, noticeTones[tone]]}>
      <View style={styles.noticeIcon}>
        <Text style={styles.noticeIconText}>
          {tone === "error" ? "!" : tone === "loading" ? "..." : "+"}
        </Text>
      </View>
      <Text style={styles.noticeTitle}>{title}</Text>
      {copy ? <Text style={styles.noticeCopy}>{copy}</Text> : null}
      {action ? <View style={styles.noticeAction}>{action}</View> : null}
    </View>
  );
}

export function HackVisual({
  alt,
  imageUrl,
  title,
  size = "card",
}: {
  alt?: string;
  imageUrl?: string | null;
  size?: "card" | "hero";
  title: string;
}) {
  const resolvedImageUrl = resolveImageUrl(imageUrl);
  const initials = title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <View style={[styles.hackVisual, size === "hero" && styles.hackVisualHero]}>
      {resolvedImageUrl ? (
        <Image
          accessibilityIgnoresInvertColors
          accessibilityLabel={alt ?? `${title} garden visual`}
          contentFit="cover"
          source={{ uri: resolvedImageUrl }}
          style={styles.hackVisualImage}
          transition={180}
        />
      ) : (
        <>
          <View style={styles.sunBubble} />
          <View style={styles.leafStem} />
          <View style={styles.leafOne} />
          <View style={styles.leafTwo} />
          <Text
            style={[
              styles.hackVisualText,
              size === "hero" && styles.hackVisualHeroText,
            ]}
          >
            {initials || "GH"}
          </Text>
        </>
      )}
      <View style={styles.hackVisualOverlay} />
    </View>
  );
}

function resolveImageUrl(imageUrl?: string | null) {
  if (!imageUrl) {
    return null;
  }

  if (/^(https?:|data:|file:)/.test(imageUrl)) {
    return imageUrl;
  }

  try {
    const baseUrl = getApiBaseUrl().replace(/\/api$/, "");
    return `${baseUrl}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
  } catch {
    return imageUrl;
  }
}

export function CommentIcon() {
  return (
    <View style={styles.commentIcon}>
      <View style={styles.commentLine} />
      <View style={[styles.commentLine, styles.commentLineShort]} />
    </View>
  );
}

export function TomatoIcon() {
  return (
    <View style={styles.tomatoIcon}>
      <View style={styles.tomatoLeaf} />
      <View style={[styles.tomatoLeaf, styles.tomatoLeafRight]} />
    </View>
  );
}

export function CucumberIcon() {
  return (
    <View style={styles.cucumberIcon}>
      <View style={styles.cucumberSeed} />
      <View style={[styles.cucumberSeed, styles.cucumberSeedTwo]} />
    </View>
  );
}

export function VoteButton({
  canVote,
  count,
  isActive,
  isPending,
  label,
  onPress,
  type,
}: {
  canVote: boolean;
  count: number;
  isActive: boolean;
  isPending: boolean;
  label: string;
  onPress: () => void;
  type: "positive" | "negative";
}) {
  const isPositive = type === "positive";

  return (
    <Pressable
      accessibilityLabel={`${label}: ${count} votes`}
      accessibilityState={{ disabled: !canVote || isPending, selected: isActive }}
      disabled={!canVote || isPending}
      onPress={onPress}
      style={({ pressed }) => [
        styles.voteButton,
        isPositive ? styles.voteButtonPositive : styles.voteButtonNegative,
        isActive && (isPositive ? styles.voteActivePositive : styles.voteActiveNegative),
        (pressed || isPending) && styles.pressed,
      ]}
    >
      <View style={styles.voteMain}>
        <View
          style={[
            styles.voteIconWrap,
            isPositive ? styles.voteIconPositive : styles.voteIconNegative,
          ]}
        >
          {isPositive ? <TomatoIcon /> : <CucumberIcon />}
        </View>
        <View style={styles.voteTextWrap}>
          <Text style={styles.voteLabel}>{label}</Text>
          <Text style={styles.voteStatus}>
            {isActive ? "Your vote" : canVote ? "Tap to vote" : "Login required"}
          </Text>
        </View>
      </View>
      <Text style={styles.voteCount}>{isPending ? "..." : count}</Text>
    </Pressable>
  );
}

const buttonVariants = StyleSheet.create({
  destructive: {
    backgroundColor: gardenTheme.colors.dangerSoft,
    borderColor: "#ffc2ad",
    borderWidth: 1,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  primary: {
    backgroundColor: gardenTheme.colors.primary,
  },
  secondary: {
    backgroundColor: "#ffffff",
    borderColor: "#b7e7d1",
    borderWidth: 1,
  },
});

const buttonTextVariants = StyleSheet.create({
  destructive: {
    color: gardenTheme.colors.danger,
  },
  ghost: {
    color: gardenTheme.colors.primaryDark,
  },
  primary: {
    color: "#ffffff",
  },
  secondary: {
    color: gardenTheme.colors.primaryDark,
  },
});

const badgeTones = StyleSheet.create({
  cream: {
    backgroundColor: gardenTheme.colors.cream,
    borderColor: "#f4dfb0",
  },
  mint: {
    backgroundColor: gardenTheme.colors.mint,
    borderColor: "#b7e7d1",
  },
  sky: {
    backgroundColor: gardenTheme.colors.sky,
    borderColor: "#b8e7ef",
  },
  tomato: {
    backgroundColor: gardenTheme.colors.tomatoSoft,
    borderColor: "#ffc2ad",
  },
});

const badgeTextTones = StyleSheet.create({
  cream: {
    color: gardenTheme.colors.amber,
  },
  mint: {
    color: gardenTheme.colors.leaf,
  },
  sky: {
    color: gardenTheme.colors.primaryDark,
  },
  tomato: {
    color: gardenTheme.colors.danger,
  },
});

const noticeTones = StyleSheet.create({
  empty: {
    backgroundColor: "#ffffff",
    borderColor: gardenTheme.colors.border,
  },
  error: {
    backgroundColor: gardenTheme.colors.dangerSoft,
    borderColor: "#ffc2ad",
  },
  loading: {
    backgroundColor: gardenTheme.colors.sky,
    borderColor: "#b8e7ef",
  },
  success: {
    backgroundColor: gardenTheme.colors.mint,
    borderColor: "#b7e7d1",
  },
});

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: gardenTheme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  button: {
    alignItems: "center",
    borderRadius: gardenTheme.radius.pill,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "900",
  },
  card: {
    backgroundColor: gardenTheme.colors.card,
    borderColor: gardenTheme.colors.border,
    borderRadius: gardenTheme.radius.lg,
    borderWidth: 1,
    gap: 12,
    padding: 16,
    ...gardenTheme.shadow,
  },
  commentIcon: {
    backgroundColor: gardenTheme.colors.sky,
    borderColor: "#b8e7ef",
    borderRadius: 10,
    borderWidth: 1,
    height: 26,
    justifyContent: "center",
    paddingHorizontal: 5,
    width: 30,
  },
  commentLine: {
    backgroundColor: gardenTheme.colors.primaryDark,
    borderRadius: 999,
    height: 3,
    marginVertical: 2,
    width: 17,
  },
  commentLineShort: {
    width: 11,
  },
  cucumberIcon: {
    backgroundColor: gardenTheme.colors.cucumber,
    borderRadius: 999,
    height: 18,
    transform: [{ rotate: "-18deg" }],
    width: 34,
  },
  cucumberSeed: {
    backgroundColor: "#c9f7d6",
    borderRadius: 999,
    height: 4,
    left: 9,
    position: "absolute",
    top: 7,
    width: 4,
  },
  cucumberSeedTwo: {
    left: 20,
  },
  eyebrow: {
    color: gardenTheme.colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  hackVisual: {
    alignItems: "center",
    backgroundColor: gardenTheme.colors.mint,
    borderColor: "#c7ebd6",
    borderRadius: gardenTheme.radius.lg,
    borderWidth: 1,
    height: 118,
    justifyContent: "center",
    overflow: "hidden",
  },
  hackVisualHero: {
    height: 210,
  },
  hackVisualHeroText: {
    fontSize: 40,
  },
  hackVisualImage: {
    ...StyleSheet.absoluteFillObject,
  },
  hackVisualOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(16, 35, 28, 0.08)",
  },
  hackVisualText: {
    color: gardenTheme.colors.leaf,
    fontSize: 28,
    fontWeight: "900",
    zIndex: 2,
  },
  leafOne: {
    backgroundColor: "#79d88a",
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 18,
    height: 38,
    position: "absolute",
    right: 34,
    top: 35,
    transform: [{ rotate: "-24deg" }],
    width: 54,
  },
  leafStem: {
    backgroundColor: gardenTheme.colors.leaf,
    borderRadius: 999,
    bottom: 0,
    height: 140,
    position: "absolute",
    right: 55,
    transform: [{ rotate: "22deg" }],
    width: 8,
  },
  leafTwo: {
    backgroundColor: "#4fc3bd",
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 18,
    bottom: 34,
    height: 32,
    left: 30,
    position: "absolute",
    transform: [{ rotate: "18deg" }],
    width: 48,
  },
  logoMark: {
    alignItems: "center",
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  logoRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  logoSubtitle: {
    color: gardenTheme.colors.primaryDark,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  logoTitle: {
    color: gardenTheme.colors.text,
    fontSize: 21,
    fontWeight: "900",
  },
  notice: {
    alignItems: "center",
    borderRadius: gardenTheme.radius.lg,
    borderWidth: 1,
    gap: 8,
    padding: 18,
  },
  noticeAction: {
    marginTop: 6,
  },
  noticeCopy: {
    color: gardenTheme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  noticeIcon: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: gardenTheme.colors.border,
    borderRadius: 16,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  noticeIconText: {
    color: gardenTheme.colors.primaryDark,
    fontSize: 16,
    fontWeight: "900",
  },
  noticeTitle: {
    color: gardenTheme.colors.text,
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
  sectionCopy: {
    color: gardenTheme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  sectionHeader: {
    gap: 5,
  },
  sectionTitle: {
    color: gardenTheme.colors.text,
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 31,
  },
  sunBubble: {
    backgroundColor: "#fff4bf",
    borderRadius: 999,
    height: 86,
    left: -16,
    position: "absolute",
    top: -20,
    width: 86,
  },
  tomatoIcon: {
    backgroundColor: gardenTheme.colors.tomato,
    borderRadius: 999,
    height: 26,
    position: "relative",
    width: 26,
  },
  tomatoLeaf: {
    backgroundColor: gardenTheme.colors.leaf,
    borderBottomLeftRadius: 6,
    borderTopRightRadius: 6,
    height: 8,
    left: 9,
    position: "absolute",
    top: -3,
    transform: [{ rotate: "-28deg" }],
    width: 11,
  },
  tomatoLeafRight: {
    left: 13,
    transform: [{ rotate: "28deg" }],
  },
  voteActiveNegative: {
    backgroundColor: "#f3fff6",
    borderColor: gardenTheme.colors.cucumber,
    borderWidth: 2,
  },
  voteActivePositive: {
    backgroundColor: "#fff8f5",
    borderColor: gardenTheme.colors.tomato,
    borderWidth: 2,
  },
  voteButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 76,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  voteButtonNegative: {
    borderColor: "#aee7c3",
  },
  voteButtonPositive: {
    borderColor: "#ffc2ad",
  },
  voteCount: {
    color: gardenTheme.colors.text,
    fontSize: 26,
    fontWeight: "900",
  },
  voteIconNegative: {
    backgroundColor: gardenTheme.colors.cucumberSoft,
  },
  voteIconPositive: {
    backgroundColor: gardenTheme.colors.tomatoSoft,
  },
  voteIconWrap: {
    alignItems: "center",
    borderRadius: 17,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  voteLabel: {
    color: gardenTheme.colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  voteMain: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 11,
  },
  voteStatus: {
    color: gardenTheme.colors.muted,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  voteTextWrap: {
    flex: 1,
    gap: 3,
  },
});

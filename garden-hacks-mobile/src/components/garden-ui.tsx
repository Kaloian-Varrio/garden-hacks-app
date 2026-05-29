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
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Ellipse,
  Circle,
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
      <Defs>
        <LinearGradient id="bgG" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#E9F7EF" />
          <Stop offset="1" stopColor="#CDE7D3" />
        </LinearGradient>

        <RadialGradient id="tomBody" cx="38" cy="42" r="44" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF6B6B" />
          <Stop offset="0.5" stopColor="#EE3131" />
          <Stop offset="1" stopColor="#A81515" />
        </RadialGradient>

        <LinearGradient id="leafFront" x1="48" y1="36" x2="72" y2="10" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#6EE7B7" />
          <Stop offset="1" stopColor="#059669" />
        </LinearGradient>

        <LinearGradient id="leafLeft" x1="48" y1="32" x2="20" y2="24" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#34D399" />
          <Stop offset="1" stopColor="#047857" />
        </LinearGradient>
      </Defs>

      {/* App Icon Base */}
      <Rect width="96" height="96" rx="22" fill="url(#bgG)" />

      {/* Soft Shadow under tomato */}
      <Ellipse cx="48" cy="82" rx="28" ry="5" fill="#A3C2A9" opacity="0.8" />

      {/* Main Tomato */}
      <Circle cx="48" cy="56" r="28" fill="url(#tomBody)" />

      {/* Glossy Highlights */}
      <Ellipse cx="36" cy="42" rx="7" ry="14" transform="rotate(-35 36 42)" fill="#FFFFFF" opacity="0.4" />
      <Path d="M 68 72 C 60 80, 36 80, 30 72 C 40 76, 58 76, 68 72" fill="#FFC9C9" opacity="0.25" />

      {/* Back little leaf */}
      <Path d="M 48 32 C 40 18, 56 18, 48 32 Z" fill="#6EE7B7" />

      {/* Left bright leaf */}
      <Path d="M 48 32 C 30 20, 16 34, 24 44 C 32 38, 44 36, 48 32 Z" fill="url(#leafLeft)" />

      {/* Right prominent leaf */}
      <Path d="M 48 32 C 72 16, 84 28, 76 44 C 64 36, 52 36, 48 32 Z" fill="url(#leafFront)" />

      {/* Leaf veins */}
      <Path d="M 48 32 Q 38 28 26 34" stroke="#064E3B" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" fill="none" />
      <Path d="M 48 32 Q 62 26 72 32" stroke="#064E3B" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" fill="none" />

      {/* Stem Star / Sepal center */}
      <Path d="M 48 28 L 44 34 L 48 36 L 52 34 Z" fill="#047857" />

      {/* Curly green stem */}
      <Path d="M 48 30 Q 52 14 62 10" stroke="#059669" strokeWidth="3" strokeLinecap="round" fill="none" />
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

export function BookmarkIcon() {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </Svg>
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

export function SaveButton({
  canSave,
  isSaved,
  isPending,
  onPress,
}: {
  canSave: boolean;
  isSaved: boolean;
  isPending: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={isSaved ? "Saved hack" : "Save hack"}
      disabled={!canSave || isPending}
      onPress={onPress}
      style={({ pressed }) => [
        styles.saveButton,
        isSaved ? styles.saveButtonActive : styles.saveButtonInactive,
        (pressed || isPending) && styles.pressed,
      ]}
    >
      <Text style={[
        styles.saveButtonIconText,
        isSaved ? styles.saveButtonTextActive : styles.saveButtonTextInactive
      ]}>
        {isSaved ? "★" : "☆"}
      </Text>
      <Text style={[
        styles.saveButtonText,
        isSaved ? styles.saveButtonTextActive : styles.saveButtonTextInactive
      ]}>
        {isPending ? "Saving..." : isSaved ? "Saved" : "Save"}
      </Text>
    </Pressable>
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
  saveButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  saveButtonActive: {
    backgroundColor: "#fff7df",
    borderColor: "#f6a13d",
  },
  saveButtonInactive: {
    backgroundColor: "#ffffff",
    borderColor: gardenTheme.colors.border,
  },
  saveButtonIconText: {
    fontSize: 16,
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: "900",
  },
  saveButtonTextActive: {
    color: "#9a4b12",
  },
  saveButtonTextInactive: {
    color: gardenTheme.colors.primaryDark,
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

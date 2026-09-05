// Central design tokens for the "Graphite" dashboard theme.
// Only visual tokens live here — no business logic.

export const colors = {
  bg: "#0A0C0F",
  bgElevated: "#101317",
  surface: "#15191E",
  surfaceAlt: "#1B2026",
  border: "#262C33",
  borderStrong: "#343B44",

  textPrimary: "#F3F5F7",
  textSecondary: "#9AA3AD",
  textMuted: "#5C636C",

  accent: "#22D3EE",
  accentDim: "#0E7490",
  accentSoft: "rgba(34, 211, 238, 0.12)",

  success: "#34D399",
  successSoft: "rgba(52, 211, 153, 0.12)",
  warning: "#FBBF24",
  warningSoft: "rgba(251, 191, 36, 0.12)",
  danger: "#F87171",
  dangerSoft: "rgba(248, 113, 113, 0.12)",
  neutral: "#9AA3AD",
  neutralSoft: "rgba(154, 163, 173, 0.12)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
};

export const typography = {
  eyebrow: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
};

// Shared shadow for cards / panels — keeps the flat-graphite look
// but gives just enough lift to separate surfaces.
export const panelShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.35,
  shadowRadius: 10,
  elevation: 4,
};

export default { colors, spacing, radii, typography, panelShadow };

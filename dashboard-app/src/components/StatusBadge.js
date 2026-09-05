import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radii } from "../theme/theme";

const TONES = {
  success: { fg: colors.success, bg: colors.successSoft },
  warning: { fg: colors.warning, bg: colors.warningSoft },
  danger: { fg: colors.danger, bg: colors.dangerSoft },
  accent: { fg: colors.accent, bg: colors.accentSoft },
  neutral: { fg: colors.neutral, bg: colors.neutralSoft },
};

export default function StatusBadge({ label, tone = "neutral" }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <View style={[styles.wrap, { backgroundColor: t.bg }]}>
      <View style={[styles.dot, { backgroundColor: t.fg }]} />
      <Text style={[styles.text, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 11, fontWeight: "700", letterSpacing: 0.6, textTransform: "uppercase" },
});

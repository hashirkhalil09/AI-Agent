import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, radii } from "../theme/theme";

export function PrimaryButton({ label, onPress, disabled, loading, style }) {
  return (
    <TouchableOpacity
      style={[styles.primary, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color="#04121A" size="small" />
      ) : (
        <Text style={styles.primaryText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

export function OutlineButton({ label, onPress, disabled, style }) {
  return (
    <TouchableOpacity
      style={[styles.outline, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={styles.outlineText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: colors.accent,
    paddingVertical: 15,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: "#04121A", textAlign: "center", fontWeight: "700", fontSize: 15, letterSpacing: 0.3 },
  outline: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 15,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineText: { color: colors.textPrimary, textAlign: "center", fontWeight: "700", fontSize: 15, letterSpacing: 0.3 },
  disabled: { opacity: 0.5 },
});

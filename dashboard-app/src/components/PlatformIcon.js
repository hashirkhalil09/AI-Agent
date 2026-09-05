import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii } from "../theme/theme";

const PLATFORM_META = {
  facebook: { icon: "logo-facebook", tint: "#4F8CFF" },
  instagram: { icon: "logo-instagram", tint: "#E1306C" },
  youtube: { icon: "logo-youtube", tint: "#FF3B30" },
  twitter: { icon: "logo-twitter", tint: "#38BDF8" },
  linkedin: { icon: "logo-linkedin", tint: "#4F8CFF" },
  tiktok: { icon: "musical-notes", tint: "#F5F5F5" },
};

export default function PlatformIcon({ platform, size = 22 }) {
  const meta = PLATFORM_META[platform] || { icon: "link", tint: colors.accent };
  return (
    <View style={[styles.tile, { width: size + 22, height: size + 22 }]}>
      <Ionicons name={meta.icon} size={size} color={meta.tint} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: radii.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
});

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import { colors, radii, spacing, typography } from "../theme/theme";
import { PrimaryButton } from "../components/Buttons";
import PlatformIcon from "../components/PlatformIcon";

const PLATFORMS = ["facebook", "instagram", "youtube", "twitter", "linkedin", "tiktok"];

export default function AddAccountScreen({ navigation }) {
  const [platform, setPlatform] = useState("facebook");
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!displayName) {
      Alert.alert("Error", "Please enter an account/page name");
      return;
    }
    setSaving(true);
    try {
      await api.post("/api/accounts", { platform, displayName });
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg, paddingTop: 60 }}>
      <Text style={typography.eyebrow}>New Connection</Text>
      <Text style={styles.title}>Add New Account</Text>

      <Text style={styles.label}>Platform</Text>
      <View style={styles.platformGrid}>
        {PLATFORMS.map((p) => {
          const active = platform === p;
          return (
            <TouchableOpacity
              key={p}
              style={[styles.platformChip, active && styles.platformChipActive]}
              onPress={() => setPlatform(p)}
              activeOpacity={0.85}
            >
              <PlatformIcon platform={p} size={18} />
              <Text style={[styles.platformText, active && styles.platformTextActive]}>{p}</Text>
              {active ? (
                <Ionicons name="checkmark-circle" size={16} color={colors.accent} style={{ marginLeft: "auto" }} />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Page / Channel Name</Text>
      <View style={styles.inputRow}>
        <Ionicons name="pricetag-outline" size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="e.g. My Business Page"
          placeholderTextColor={colors.textMuted}
          value={displayName}
          onChangeText={setDisplayName}
        />
      </View>

      <View style={styles.noteBox}>
        <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
        <Text style={styles.note}>
          Note: This only creates the account record. To actually publish, you'll
          need to connect that platform's Developer App (Phase 2) — the Access
          Token will need to be added to the backend's .env file.
        </Text>
      </View>

      <PrimaryButton
        label={saving ? "Saving..." : "Save Account"}
        onPress={handleSave}
        disabled={saving}
        loading={saving}
        style={{ marginTop: spacing.xl }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { ...typography.title, marginTop: 4, marginBottom: spacing.lg },
  label: { ...typography.label, marginBottom: spacing.sm, marginTop: spacing.md },
  platformGrid: { gap: spacing.sm },
  platformChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  platformChipActive: { borderColor: colors.accentDim, backgroundColor: colors.accentSoft },
  platformText: { color: colors.textSecondary, marginLeft: spacing.sm, textTransform: "capitalize", fontWeight: "600" },
  platformTextActive: { color: colors.textPrimary },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
  },
  input: { flex: 1, color: colors.textPrimary, paddingVertical: 13, fontSize: 14 },
  noteBox: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  note: { flex: 1, color: colors.textMuted, fontSize: 12, lineHeight: 18 },
});

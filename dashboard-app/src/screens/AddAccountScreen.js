import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import api from "../services/api";

const PLATFORMS = ["facebook", "instagram", "youtube", "twitter", "linkedin", "tiktok"];

export default function AddAccountScreen({ navigation }) {
  const [platform, setPlatform] = useState("facebook");
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!displayName) {
      Alert.alert("Error", "Account/Page ka naam likho");
      return;
    }
    setSaving(true);
    try {
      await api.post("/api/accounts", { platform, displayName });
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Save nahi hua");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
      <Text style={styles.title}>Naya Account Add Karo</Text>

      <Text style={styles.label}>Platform</Text>
      <View style={styles.platformRow}>
        {PLATFORMS.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.platformChip, platform === p && styles.platformChipActive]}
            onPress={() => setPlatform(p)}
          >
            <Text style={[styles.platformText, platform === p && styles.platformTextActive]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Page / Channel Naam</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. My Business Page"
        placeholderTextColor="#888"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <Text style={styles.note}>
        Note: Ye sirf account record banata hai. Actual publishing ke liye is
        platform ka Developer App connect karna hoga (Phase 2) — Access Token
        backend ke .env mein daalna padega.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? "Saving..." : "Save Account"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827" },
  title: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 20 },
  label: { color: "#9CA3AF", marginBottom: 8, marginTop: 12 },
  platformRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  platformChip: {
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  platformChipActive: { backgroundColor: "#4F46E5", borderColor: "#4F46E5" },
  platformText: { color: "#9CA3AF" },
  platformTextActive: { color: "#fff", fontWeight: "600" },
  input: { backgroundColor: "#1F2937", color: "#fff", padding: 14, borderRadius: 10 },
  note: { color: "#6B7280", fontSize: 12, marginTop: 16, lineHeight: 18 },
  button: { backgroundColor: "#4F46E5", padding: 16, borderRadius: 10, marginTop: 30 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});

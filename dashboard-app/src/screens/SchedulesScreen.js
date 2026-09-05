import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import { colors, radii, spacing, typography, panelShadow } from "../theme/theme";
import { PrimaryButton, OutlineButton } from "../components/Buttons";

export default function SchedulesScreen({ route, navigation }) {
  const { accountId, accountName } = route.params;
  const [schedules, setSchedules] = useState([]);
  const [cronExpression, setCronExpression] = useState("0 9,18 * * *");
  const [topic, setTopic] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await api.get(`/api/schedules?accountId=${accountId}`);
    setSchedules(res.data);
  }, [accountId]);

  useEffect(() => {
    load();
  }, [load]);

  const addSchedule = async () => {
    if (!topic) {
      Alert.alert("Error", "Please enter a content topic, e.g. 'daily motivation quotes'");
      return;
    }
    setSaving(true);
    try {
      await api.post("/api/schedules", { accountId, cronExpression, contentTopic: topic });
      setTopic("");
      load();
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const generateNow = async () => {
    try {
      await api.post("/api/posts/generate", {
        accountId,
        topic: topic || "general update",
        contentType: "text_image",
        publishNow: true,
      });
      Alert.alert("Done", "Post generated and publish triggered.");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Failed to generate");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: 60, paddingBottom: 40 }}
        ListHeaderComponent={
          <View>
            <Text style={typography.eyebrow}>Automation</Text>
            <Text style={styles.title}>{accountName}</Text>
            <Text style={styles.subtitle}>Posting Schedule</Text>

            <View style={styles.panel}>
              <Text style={typography.label}>Cron Time</Text>
              <Text style={styles.hint}>Default: daily at 9am and 6pm</Text>
              <View style={styles.inputRow}>
                <Ionicons name="time-outline" size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  style={[styles.input, styles.mono]}
                  value={cronExpression}
                  onChangeText={setCronExpression}
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <Text style={[typography.label, { marginTop: spacing.lg }]}>Content Topic</Text>
              <Text style={styles.hint}>The AI will use this as a content brief</Text>
              <View style={styles.inputRow}>
                <Ionicons name="sparkles-outline" size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Motivational quotes for entrepreneurs"
                  placeholderTextColor={colors.textMuted}
                  value={topic}
                  onChangeText={setTopic}
                />
              </View>

              <View style={styles.row}>
                <PrimaryButton
                  label={saving ? "Saving..." : "Add Schedule"}
                  onPress={addSchedule}
                  disabled={saving}
                  loading={saving}
                  style={{ flex: 1, marginRight: spacing.sm }}
                />
                <OutlineButton label="Post Now" onPress={generateNow} style={{ flex: 1 }} />
              </View>
            </View>

            <View style={styles.listHeaderRow}>
              <Text style={styles.listHeader}>Active Schedules</Text>
              <View style={styles.countPill}>
                <Text style={styles.countText}>{schedules.length}</Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="calendar-outline" size={28} color={colors.textMuted} />
            <Text style={styles.empty}>No schedules yet.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleIconWrap}>
              <Ionicons name="repeat-outline" size={16} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.scheduleTopic}>{item.contentTopic}</Text>
              <Text style={[styles.scheduleCron, styles.mono]}>{item.cronExpression}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { ...typography.title, marginTop: 4 },
  subtitle: { ...typography.subtitle, marginBottom: spacing.lg },
  panel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  hint: { color: colors.textMuted, fontSize: 11, marginBottom: spacing.xs },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
  },
  input: { flex: 1, color: colors.textPrimary, paddingVertical: 12, fontSize: 14 },
  mono: { letterSpacing: 0.5 },
  row: { flexDirection: "row", marginTop: spacing.xl },
  listHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  listHeader: { color: colors.textPrimary, fontWeight: "700", fontSize: 14, letterSpacing: 0.3 },
  countPill: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  countText: { color: colors.textSecondary, fontSize: 12, fontWeight: "700" },
  emptyWrap: { alignItems: "center", marginTop: spacing.xl, gap: 10 },
  empty: { color: colors.textMuted, textAlign: "center" },
  scheduleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...panelShadow,
  },
  scheduleIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  scheduleTopic: { color: colors.textPrimary, fontWeight: "600", fontSize: 14 },
  scheduleCron: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
});

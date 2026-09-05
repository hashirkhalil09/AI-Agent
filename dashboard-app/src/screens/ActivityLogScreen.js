import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import { colors, radii, spacing, typography, panelShadow } from "../theme/theme";
import ScreenHeader from "../components/ScreenHeader";
import StatusBadge from "../components/StatusBadge";

export default function ActivityLogScreen() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/api/posts").then((res) => setPosts(res.data));
  }, []);

  const statusTone = { published: "success", failed: "danger", draft: "neutral", scheduled: "warning" };

  return (
    <View style={styles.container}>
      <ScreenHeader eyebrow="Automation" title="Activity Log" subtitle={`${posts.length} recent posts`} />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="document-text-outline" size={28} color={colors.textMuted} />
            <Text style={styles.empty}>No posts yet.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.account}>{item.account?.displayName}</Text>
              <StatusBadge label={item.status} tone={statusTone[item.status] || "neutral"} />
            </View>
            <Text style={styles.caption} numberOfLines={2}>{item.caption}</Text>
            {item.errorMsg ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle-outline" size={14} color={colors.danger} />
                <Text style={styles.error}>{item.errorMsg}</Text>
              </View>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  emptyWrap: { alignItems: "center", marginTop: 60, gap: 10 },
  empty: { color: colors.textMuted, textAlign: "center" },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...panelShadow,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm },
  account: { color: colors.textPrimary, fontWeight: "700", fontSize: 14 },
  caption: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
  errorRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.sm },
  error: { color: colors.danger, fontSize: 12 },
});

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import { colors, radii, spacing, typography, panelShadow } from "../theme/theme";
import ScreenHeader from "../components/ScreenHeader";
import StatusBadge from "../components/StatusBadge";
import PlatformIcon from "../components/PlatformIcon";

export default function AccountsScreen({ navigation }) {
  const [accounts, setAccounts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.get("/api/accounts");
      setAccounts(res.data);
    } catch (err) {
      console.warn(err.message);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation, load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        eyebrow="Dashboard"
        title="My Accounts"
        subtitle={`${accounts.length} connected ${accounts.length === 1 ? "account" : "accounts"}`}
        action={{
          label: "Add",
          icon: <Ionicons name="add" size={16} color={colors.accent} />,
          onPress: () => navigation.navigate("AddAccount"),
        }}
      />

      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl tintColor={colors.accent} refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="cube-outline" size={32} color={colors.textMuted} />
            <Text style={styles.empty}>No accounts added yet. Tap "+ Add" to get started.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Schedules", { accountId: item.id, accountName: item.displayName })}
          >
            <PlatformIcon platform={item.platform} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.displayName}</Text>
              <Text style={styles.cardSub}>{item.platform}</Text>
            </View>
            <StatusBadge
              label={item.active ? "Active" : "Paused"}
              tone={item.active ? "success" : "neutral"}
            />
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} style={{ marginLeft: spacing.sm }} />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.logBtn} onPress={() => navigation.navigate("ActivityLog")}>
        <Ionicons name="pulse-outline" size={16} color={colors.accent} />
        <Text style={styles.logBtnText}>View Activity Log</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.accent} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  emptyWrap: { alignItems: "center", justifyContent: "center", marginTop: 60, gap: 12 },
  empty: { color: colors.textMuted, textAlign: "center", paddingHorizontal: 30 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...panelShadow,
  },
  cardTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: "700" },
  cardSub: { color: colors.textSecondary, fontSize: 12, marginTop: 2, textTransform: "capitalize" },
  logBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bgElevated,
  },
  logBtnText: { color: colors.accent, fontWeight: "700", fontSize: 13, letterSpacing: 0.3 },
});

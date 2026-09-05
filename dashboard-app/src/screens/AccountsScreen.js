import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import api from "../services/api";

const PLATFORM_EMOJI = {
  facebook: "📘",
  instagram: "📸",
  youtube: "▶️",
  twitter: "𝕏",
  linkedin: "💼",
  tiktok: "🎵",
};

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
      <View style={styles.header}>
        <Text style={styles.title}>Mere Accounts</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate("AddAccount")}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Abhi koi account add nahi hua. "+ Add" dabao.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Schedules", { accountId: item.id, accountName: item.displayName })}
          >
            <Text style={styles.emoji}>{PLATFORM_EMOJI[item.platform] || "🔗"}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.displayName}</Text>
              <Text style={styles.cardSub}>
                {item.platform} · {item.active ? "Active" : "Paused"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.logBtn} onPress={() => navigation.navigate("ActivityLog")}>
        <Text style={styles.logBtnText}>Activity Log dekho →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "700" },
  addBtn: { backgroundColor: "#4F46E5", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: "#fff", fontWeight: "600" },
  empty: { color: "#9CA3AF", textAlign: "center", marginTop: 40 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  emoji: { fontSize: 26, marginRight: 14 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  cardSub: { color: "#9CA3AF", fontSize: 13, marginTop: 2 },
  logBtn: { padding: 16, alignItems: "center" },
  logBtnText: { color: "#818CF8", fontWeight: "600" },
});

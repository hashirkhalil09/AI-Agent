import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import api from "../services/api";

export default function ActivityLogScreen() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/api/posts").then((res) => setPosts(res.data));
  }, []);

  const statusColor = { published: "#22C55E", failed: "#EF4444", draft: "#9CA3AF", scheduled: "#FACC15" };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Log</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>Abhi koi post nahi bana.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.account}>{item.account?.displayName}</Text>
              <Text style={[styles.status, { color: statusColor[item.status] || "#fff" }]}>
                {item.status}
              </Text>
            </View>
            <Text style={styles.caption} numberOfLines={2}>{item.caption}</Text>
            {item.errorMsg ? <Text style={styles.error}>{item.errorMsg}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827", paddingTop: 50 },
  title: { color: "#fff", fontSize: 20, fontWeight: "700", paddingHorizontal: 16 },
  empty: { color: "#6B7280", textAlign: "center", marginTop: 40 },
  card: { backgroundColor: "#1F2937", borderRadius: 10, padding: 14, marginBottom: 10 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  account: { color: "#fff", fontWeight: "600" },
  status: { fontSize: 12, fontWeight: "700", textTransform: "uppercase" },
  caption: { color: "#D1D5DB", fontSize: 13 },
  error: { color: "#EF4444", fontSize: 12, marginTop: 6 },
});

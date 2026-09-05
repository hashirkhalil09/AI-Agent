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
import api from "../services/api";

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
      Alert.alert("Error", "Content topic likho, e.g. 'daily motivation quotes'");
      return;
    }
    setSaving(true);
    try {
      await api.post("/api/schedules", { accountId, cronExpression, contentTopic: topic });
      setTopic("");
      load();
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Save nahi hua");
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
      Alert.alert("Done", "Post generate + publish trigger ho gaya.");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Generate nahi hua");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{accountName}</Text>
      <Text style={styles.subtitle}>Posting Schedule</Text>

      <Text style={styles.label}>Cron time (default: roz 9am aur 6pm)</Text>
      <TextInput style={styles.input} value={cronExpression} onChangeText={setCronExpression} />

      <Text style={styles.label}>Content Topic (AI isko brief ki tarah use karega)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Motivational quotes for entrepreneurs"
        placeholderTextColor="#888"
        value={topic}
        onChangeText={setTopic}
      />

      <View style={styles.row}>
        <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 8 }]} onPress={addSchedule} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? "Saving..." : "Schedule Add Karo"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonOutline, { flex: 1 }]} onPress={generateNow}>
          <Text style={styles.buttonOutlineText}>Abhi Post Karo</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.listHeader}>Active Schedules</Text>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={<Text style={styles.empty}>Koi schedule nahi hai abhi.</Text>}
        renderItem={({ item }) => (
          <View style={styles.scheduleCard}>
            <Text style={styles.scheduleTopic}>{item.contentTopic}</Text>
            <Text style={styles.scheduleCron}>⏱ {item.cronExpression}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827", padding: 20, paddingTop: 60 },
  title: { color: "#fff", fontSize: 20, fontWeight: "700" },
  subtitle: { color: "#9CA3AF", marginBottom: 20 },
  label: { color: "#9CA3AF", marginTop: 12, marginBottom: 6, fontSize: 13 },
  input: { backgroundColor: "#1F2937", color: "#fff", padding: 12, borderRadius: 10 },
  row: { flexDirection: "row", marginTop: 20 },
  button: { backgroundColor: "#4F46E5", padding: 14, borderRadius: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600", fontSize: 13 },
  buttonOutline: { borderWidth: 1, borderColor: "#4F46E5", padding: 14, borderRadius: 10 },
  buttonOutlineText: { color: "#818CF8", textAlign: "center", fontWeight: "600", fontSize: 13 },
  listHeader: { color: "#fff", fontWeight: "600", marginTop: 30, marginBottom: 10 },
  empty: { color: "#6B7280", textAlign: "center", marginTop: 20 },
  scheduleCard: { backgroundColor: "#1F2937", borderRadius: 10, padding: 14, marginBottom: 8 },
  scheduleTopic: { color: "#fff", fontWeight: "500" },
  scheduleCron: { color: "#9CA3AF", fontSize: 12, marginTop: 4 },
});

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email aur password dono zaroori hain");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      await AsyncStorage.setItem("token", res.data.token);
      navigation.replace("Accounts");
    } catch (err) {
      Alert.alert("Login failed", err.response?.data?.error || "Kuch ghalat ho gaya");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Social Agent</Text>
      <Text style={styles.subtitle}>Owner Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827", justifyContent: "center", padding: 24 },
  title: { color: "#fff", fontSize: 28, fontWeight: "700", textAlign: "center" },
  subtitle: { color: "#9CA3AF", fontSize: 14, textAlign: "center", marginBottom: 32 },
  input: {
    backgroundColor: "#1F2937",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  button: { backgroundColor: "#4F46E5", padding: 16, borderRadius: 10, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600", fontSize: 16 },
});

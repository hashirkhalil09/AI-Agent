import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import { colors, radii, spacing, typography } from "../theme/theme";
import { PrimaryButton } from "../components/Buttons";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Both email and password are required");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      await AsyncStorage.setItem("token", res.data.token);
      navigation.replace("Accounts");
    } catch (err) {
      Alert.alert("Login failed", err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.brandMark}>
        <View style={styles.brandRing}>
          <Ionicons name="hardware-chip-outline" size={30} color={colors.accent} />
        </View>
      </View>

      <Text style={typography.eyebrow}>Owner Console</Text>
      <Text style={styles.title}>AI Social Agent</Text>
      <Text style={styles.subtitle}>Secure sign-in to your automation dashboard</Text>

      <View style={styles.panel}>
        <Text style={typography.label}>Email</Text>
        <View style={styles.inputRow}>
          <Ionicons name="mail-outline" size={16} color={colors.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={[typography.label, { marginTop: spacing.lg }]}>Password</Text>
        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={16} color={colors.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <PrimaryButton
          label={loading ? "Logging in..." : "Login"}
          onPress={handleLogin}
          disabled={loading}
          loading={loading}
          style={{ marginTop: spacing.xl }}
        />
      </View>

      <Text style={styles.footer}>
        System status: <Text style={{ color: colors.success }}>Online</Text>
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: "center", padding: spacing.xl },
  brandMark: { alignItems: "center", marginBottom: spacing.lg },
  brandRing: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.accentDim,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { ...typography.title, textAlign: "center", fontSize: 26, marginTop: 6 },
  subtitle: { ...typography.subtitle, textAlign: "center", marginBottom: spacing.xl, marginTop: 6 },
  panel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, color: colors.textPrimary, paddingVertical: 13, fontSize: 15 },
  footer: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.xl,
    letterSpacing: 0.4,
  },
});

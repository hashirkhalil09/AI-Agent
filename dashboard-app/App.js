import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import AccountsScreen from "./src/screens/AccountsScreen";
import AddAccountScreen from "./src/screens/AddAccountScreen";
import SchedulesScreen from "./src/screens/SchedulesScreen";
import ActivityLogScreen from "./src/screens/ActivityLogScreen";
import { colors } from "./src/theme/theme";

const Stack = createNativeStackNavigator();

const graphiteNavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bgElevated,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.accent,
  },
};

export default function App() {
  return (
    <NavigationContainer theme={graphiteNavTheme}>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: colors.bgElevated },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Accounts" component={AccountsScreen} />
        <Stack.Screen name="AddAccount" component={AddAccountScreen} options={{ headerShown: true, title: "" }} />
        <Stack.Screen name="Schedules" component={SchedulesScreen} options={{ headerShown: true, title: "" }} />
        <Stack.Screen name="ActivityLog" component={ActivityLogScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

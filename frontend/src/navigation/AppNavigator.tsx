import React from "react";
import { useColorScheme } from "react-native";
import { NavigationContainer, DarkTheme as NavDark, DefaultTheme as NavLight } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

import { useExpensesStore } from "../store/useExpensesStore";
import { DashboardScreen } from "../screens/DashboardScreen";
import { ExpensesListScreen } from "../screens/ExpensesListScreen";
import { AddEditExpenseScreen } from "../screens/AddEditExpenseScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { ExpensesStackParamList, RootTabParamList } from "../types";

const Tabs = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<ExpensesStackParamList>();

function ExpensesFlow() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="ExpensesList" component={ExpensesListScreen} options={{ title: "Expenses" }} />
      <Stack.Screen
        name="AddEditExpense"
        component={AddEditExpenseScreen}
        options={({ route }) => ({ title: route.params?.id ? "Edit" : "Add" })}
      />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const paperTheme = useTheme();
  const systemScheme = useColorScheme();
  const themeMode = useExpensesStore((s) => s.themeMode);
  const isDark = themeMode === "dark" || (themeMode === "system" && systemScheme === "dark");

  return (
    <NavigationContainer theme={isDark ? NavDark : NavLight}>
      <Tabs.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: paperTheme.colors.primary,
          tabBarStyle: {
            backgroundColor: paperTheme.colors.surface,
            borderTopColor: paperTheme.colors.outlineVariant,
          },
        }}
      >
        <Tabs.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home-variant" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="ExpensesTab"
          component={ExpensesFlow}
          options={{
            tabBarLabel: "Expenses",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="wallet-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog-outline" color={color} size={size} />
            ),
          }}
        />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}

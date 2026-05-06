import React, { useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { PaperProvider, Text } from "react-native-paper";

import { AppNavigator } from "./src/navigation/AppNavigator";
import { useExpensesStore } from "./src/store/useExpensesStore";
import { darkPaperTheme, lightPaperTheme } from "./src/theme/paperTheme";
import { startAutoSync } from "./src/autoSync";

export default function App() {
  const [started, setStarted] = useState(false);
  const load = useExpensesStore((s) => s.load);
  const themeMode = useExpensesStore((s) => s.themeMode);
  const systemScheme = useColorScheme();

  const isDark = useMemo(
    () => themeMode === "dark" || (themeMode === "system" && systemScheme === "dark"),
    [themeMode, systemScheme]
  );

  useEffect(() => {
    load().finally(() => setStarted(true));

    // Start background auto-sync (every 30 seconds while online)
    const unsubscribe = startAutoSync(30_000);
    return () => {
      unsubscribe();
    };
  }, [load]);

  return (
    <PaperProvider theme={isDark ? darkPaperTheme : lightPaperTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      {!started ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
          <Text variant="bodyLarge" style={{ marginTop: 16 }}>
            Loading…
          </Text>
        </View>
      ) : (
        <AppNavigator />
      )}
    </PaperProvider>
  );
}

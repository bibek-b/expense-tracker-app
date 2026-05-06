import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Appbar,
  Button,
  Divider,
  SegmentedButtons,
  Snackbar,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

import { useExpensesStore } from "../store/useExpensesStore";
import type { ThemeMode } from "../types";

export function SettingsScreen() {
  const theme = useTheme();
  const monthlyBudget = useExpensesStore((s) => s.monthlyBudget);
  const themeMode = useExpensesStore((s) => s.themeMode);
  const setMonthlyBudget = useExpensesStore((s) => s.setMonthlyBudget);
  const setThemeMode = useExpensesStore((s) => s.setThemeMode);
  const syncPush = useExpensesStore((s) => s.syncPush);
  const syncPull = useExpensesStore((s) => s.syncPull);

  const [budgetText, setBudgetText] = useState(
    monthlyBudget != null ? String(monthlyBudget) : "",
  );
  const [snack, setSnack] = useState<{ msg: string; err?: boolean } | null>(
    null,
  );

  useEffect(() => {
    setBudgetText(monthlyBudget != null ? String(monthlyBudget) : "");
  }, [monthlyBudget]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header elevated mode="center-aligned">
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 8 }}
      >
        <Text variant="titleMedium" style={{ marginBottom: 4 }}>
          Appearance
        </Text>
        <SegmentedButtons
          value={themeMode}
          onValueChange={(v) => v && void setThemeMode(v as ThemeMode)}
          buttons={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "System" },
          ]}
        />

        <Divider style={{ marginVertical: 16 }} />

        <Text variant="titleMedium" style={{ marginBottom: 4 }}>
          Monthly budget
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}
        >
          Get an alert when this month’s total goes over this amount (leave
          empty to turn off).
        </Text>
        <TextInput
          label="Budget amount"
          keyboardType="decimal-pad"
          value={budgetText}
          mode="outlined"
          onChangeText={setBudgetText}
        />
        <Button
          mode="contained"
          onPress={() => {
            const t = budgetText.trim();
            if (!t) void setMonthlyBudget(null);
            else {
              const n = Number(t.replace(",", "."));
              if (Number.isFinite(n) && n > 0) void setMonthlyBudget(n);
              else
                setSnack({
                  msg: "Enter a positive number or clear the field.",
                  err: true,
                });
            }
          }}
          style={{ marginTop: 8 }}
        >
          Save budget
        </Button>

        <Divider style={{ marginVertical: 16 }} />

        <Text variant="titleMedium" style={{ marginBottom: 4 }}>
          Cloud sync
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}
        >
          Chill! Datas are automatically synced to the cloud when you go online.
        </Text>
        
      </ScrollView>

      <Snackbar
        visible={!!snack}
        onDismiss={() => setSnack(null)}
        duration={4000}
        style={
          snack?.err
            ? { backgroundColor: theme.colors.errorContainer }
            : undefined
        }
      >
        {snack?.msg}
      </Snackbar>
    </View>
  );
}

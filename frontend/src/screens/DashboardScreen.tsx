import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Appbar, Card, ProgressBar, Text, useTheme } from "react-native-paper";

import { useExpensesStore } from "../store/useExpensesStore";
import { monthEndYYYYMMDD, monthStartYYYYMMDD } from "../utils/date";

export function DashboardScreen() {
  const theme = useTheme();
  const expenses = useExpensesStore((s) => s.expenses);
  const monthlyBudget = useExpensesStore((s) => s.monthlyBudget);
  const reload = useExpensesStore((s) => s.reload);
  

  const start = monthStartYYYYMMDD();
  const end = monthEndYYYYMMDD();

  const monthItems = useMemo(
    () => expenses.filter((e) => e.date >= start && e.date <= end),
    [expenses, start, end],
  );

  const total = useMemo(
    () => monthItems.reduce((s, e) => s + e.amount, 0),
    [monthItems],
  );

  // Calculate total expenses by category for the current month, used for the "By category" section of the dashboard. Groups expenses by category and sums amounts, then sorts by amount descending(highest first).
  const byCategory = useMemo(() => {
  const totals = new Map<string, number>(); //used map because it's more efficient for grouping and summing by category. Key is category name, value is total amount.

  monthItems.forEach(item => {
    totals.set(
      item.category,
      (totals.get(item.category) || 0) + item.amount
    );
  });

  return Array.from(totals, ([category, amount]) => ({
    category,
    amount,
  })).sort((a, b) => b.amount - a.amount); //highest amount first
}, [monthItems]);

  // Find the maximum category total for the progress bars in the "By category" section. 
  const max = Math.max(0, ...byCategory.map((x) => x.amount));

  console.log({max})

  // Determine the user's monthly budget for the progress bar in the "Spent this month" section. 
  const budgetCap = monthlyBudget != null && monthlyBudget > 0 ? monthlyBudget : null;

  const overBudget = budgetCap != null && total > budgetCap;

  // Calculate the percentage of the budget used for the progress bar in the "Spent this month" section. 
  const progress = budgetCap != null ? Math.min(1, total / budgetCap) : 0;


  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header
        elevated
        mode="small"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <Appbar.Content title="Overview" subtitle={`${start} → ${end}`} />
        <Appbar.Action icon="refresh" onPress={() => void reload()} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        <Card mode="elevated" style={{ borderRadius: 16 }}>
          <Card.Content style={{ gap: 8 }}>
            <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
              Spent this month
            </Text>
            <Text variant="displaySmall" style={{ fontWeight: "700" }}>
              {total.toFixed(2)}
            </Text>
            {budgetCap != null ? (
              <>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Budget {budgetCap.toFixed(2)} · {Math.round(progress * 100)}%
                  used
                  {overBudget ? " · over limit" : ""}
                </Text>
                <ProgressBar
                  progress={progress}
                  color={overBudget ? theme.colors.error : theme.colors.primary}
                  style={{ height: 10, borderRadius: 6, marginTop: 4 }}
                />
              </>
            ) : (
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Set a monthly budget in Settings to track limits.
              </Text>
            )}
          </Card.Content>
        </Card>

        <Card mode="outlined" style={{ borderRadius: 16 }}>
          <Card.Title title="By category" titleStyle={{ fontSize: 18 }} />
          <Card.Content style={{ gap: 12 }}>
            {byCategory.length === 0 ? (
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                No expenses yet this month. Add some under Expenses.
              </Text>
            ) : null}
            {byCategory.map((row) => (
              <View key={row.category} style={{ gap: 6 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text variant="bodyLarge">{row.category}</Text>
                  <Text
                    variant="titleMedium"
                    style={{ fontVariant: ["tabular-nums"] }}
                  >
                    {row.amount.toFixed(2)}
                  </Text>
                </View>
                <View
                  style={{
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: theme.colors.surfaceVariant,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: 8,
                      width: `${max ? (row.amount / max) * 100 : 0}%`,
                      borderRadius: 999,
                      backgroundColor: theme.colors.primary,
                    }}
                  />
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

import React, { useMemo, useState } from "react";
import { Alert, FlatList, ScrollView, View } from "react-native";
import {
  Appbar,
  Button,
  Chip,
  FAB,
  List,
  Searchbar,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

import { useExpensesStore } from "../store/useExpensesStore";
import type { ExpenseCategory, ExpensesListScreenProps } from "../types";
import { CATEGORIES } from "../utils/categories";
import { passesFilters } from "../utils/expenseHelpers";

const ALL_CATEGORIES: Array<"All" | ExpenseCategory> = ["All", ...CATEGORIES];

export function ExpensesListScreen({ navigation }: ExpensesListScreenProps) {
  const theme = useTheme();
  const { expenses, filters, setFilters, clearFilters, remove, reload } =
    useExpensesStore();

  const [showFilters, setShowFilters] = useState(false);

  const visible = useMemo(
    () => expenses.filter((e) => passesFilters(e, filters)),
    [expenses, filters],
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="All expenses" />
        <Appbar.Action
          icon={showFilters ? "filter-off" : "filter-variant"}
          onPress={() => setShowFilters((v) => !v)}
        />
        <Appbar.Action icon="refresh" onPress={() => void reload()} />
      </Appbar.Header>

      <Searchbar
        placeholder="Search notes, category, amount…"
        value={filters.query}
        onChangeText={(query) => setFilters({ query })}
        elevation={1}
        style={{
          marginHorizontal: 12,
          marginTop: 8,
          marginBottom: 8,
          borderRadius: 12,
        }}
      />

      {showFilters && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 12,
            gap: 8,
            paddingBottom: 8,
          }}
        >
          {ALL_CATEGORIES.map((c) => (
            <Chip
              key={c}
              selected={filters.category === c}
              onPress={() => setFilters({ category: c })}
              style={{
                backgroundColor:
                  filters.category === c
                    ? theme.colors.secondaryContainer
                    : undefined,
                height: 50,
              }}
            >
              {c}
            </Chip>
          ))}
        </ScrollView>
      )}

      {showFilters && (
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            paddingHorizontal: 12,
            marginBottom: 8,
          }}
        >
          <TextInput
            label="From"
            placeholder="YYYY-MM-DD"
            value={filters.dateFrom}
            onChangeText={(dateFrom) => setFilters({ dateFrom })}
            mode="outlined"
            dense
            style={{ flex: 1 }}
          />
          <TextInput
            label="To"
            placeholder="YYYY-MM-DD"
            value={filters.dateTo}
            onChangeText={(dateTo) => setFilters({ dateTo })}
            mode="outlined"
            dense
            style={{ flex: 1 }}
          />
        </View>
      )}

      {showFilters && (
        <Button
          mode="text"
          onPress={clearFilters}
          style={{ alignSelf: "flex-start", marginLeft: 8 }}
        >
          Clear filters
        </Button>
      )}

      <FlatList
        data={visible}
        keyExtractor={(e) => e.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 96 }}
        ListEmptyComponent={
          <Text
            style={{
              padding: 16,
              textAlign: "center",
              color: theme.colors.onSurfaceVariant,
            }}
          >
            Nothing here yet. Tap + to add an expense.
          </Text>
        }
        renderItem={({ item }) => (
          <Surface
            style={{
              marginBottom: 10,
              borderRadius: 14,
              backgroundColor:
                (theme.colors as { surfaceContainerLow?: string })
                  .surfaceContainerLow ?? theme.colors.surfaceVariant,
            }}
            elevation={1}
          >
            <List.Item
              title={`${item.category} · ${item.amount.toFixed(2)}`}
              titleStyle={{ fontWeight: "600" }}
              description={`${item.date}${item.note ? ` · ${item.note}` : ""}`}
              descriptionNumberOfLines={2}
              onPress={() =>
                navigation.navigate("AddEditExpense", { id: item.id })
              }
              onLongPress={() =>
                Alert.alert(
                  "Delete expense?",
                  `${item.category} ${item.amount.toFixed(2)}`,
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => void remove(item.id),
                    },
                  ],
                )
              }
            />
          </Surface>
        )}
      />

      <FAB
        icon="plus"
        style={{
          position: "absolute",
          right: 20,
          bottom: 24,
          borderRadius: 16,
        }}
        onPress={() => navigation.navigate("AddEditExpense")}
      />
    </View>
  );
}

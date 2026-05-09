import React, { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Appbar,
  Button,
  HelperText,
  Menu,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

import { useExpensesStore } from "../store/useExpensesStore";
import type { ExpenseCategory, ExpensesStackParamList } from "../types";
import { CATEGORIES } from "../utils/categories";
import { todayYYYYMMDD, toYYYYMMDD } from "../utils/date";

type Props = NativeStackScreenProps<ExpensesStackParamList, "AddEditExpense">;

export function AddEditExpenseScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const id = route.params?.id;
  const existing = useExpensesStore((s) => (id ? s.getById(id) : undefined));
  const add = useExpensesStore((s) => s.add);
  const update = useExpensesStore((s) => s.update);

  const [amountText, setAmountText] = useState(
    existing ? String(existing.amount) : "",
  );
  const [note, setNote] = useState(existing?.note ?? "");
  const [category, setCategory] = useState<ExpenseCategory>(
    existing?.category ?? "Other",
  );
  const [date, setDate] = useState(existing?.date ?? todayYYYYMMDD());
  const [pickDate, setPickDate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setAmountText(String(existing.amount));
    setNote(existing.note ?? "");
    setCategory(existing.category);
    setDate(existing.date);
  }, [existing]);

  const amount = useMemo(() => Number(amountText), [amountText]);
  const okAmount = Number.isFinite(amount) && amount > 0;

  const handleSaveExpense = async () => {
    setBusy(true);
    try {
      if (id) {
        await update(id, { amount, category, date, note });
      } else {
        await add({ amount, category, date, note });
      }
      navigation.goBack();
    } finally {
      setBusy(false);
    }
  };

  const handleDateChange = (_: any, d?: Date) => {
    setPickDate(false);
    if (d) setDate(toYYYYMMDD(d));
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={id ? "Edit expense" : "New expense"} />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
          <TextInput
            label="Amount"
            keyboardType="decimal-pad"
            value={amountText}
            onChangeText={(t) => setAmountText(t.replace(",", "."))}
            mode="outlined"
          />
          <HelperText type="error" visible={!okAmount && amountText.length > 0}>
            Enter a number greater than 0
          </HelperText>

          <Text variant="labelLarge">Category</Text>
          <Menu
            visible={menuOpen}
            onDismiss={() => setMenuOpen(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuOpen(true)}
                icon="chevron-down"
              >
                {category}
              </Button>
            }
          >
            {CATEGORIES.map((c) => (
              <Menu.Item
                key={c}
                title={c}
                onPress={() => {
                  setCategory(c);
                  setMenuOpen(false);
                }}
              />
            ))}
          </Menu>

          <Button
            mode="outlined"
            icon="calendar"
            onPress={() => setPickDate(true)}
          >
            Date: {date}
          </Button>

          <TextInput
            label="Note (optional)"
            value={note}
            mode="outlined"
            onChangeText={(t) => {
              setNote(t);
            }}
          />

          <Button
            mode="contained"
            disabled={!okAmount || busy}
            loading={busy}
            onPress={handleSaveExpense}
          >
            Save
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      {pickDate && (
        <DateTimePicker
          mode="date"
          value={new Date(date)}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

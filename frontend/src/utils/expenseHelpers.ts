import { Alert } from "react-native";
import { saveSettings } from "../storage";
import { AppSettings, Expense, ExpenseFilters, useExpensesStoreType } from "../types";
import { currentYYYYMM, sumExpensesInMonth } from "./date";

// Generate a new unique ID for an expense item. useful for crud operations before syncing with the backend. Combines current timestamp with random string.
export const getNewId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

// Sort newest expenses first by date, then by updatedAt.
export const sortList = (list: Expense[]) => {
  return [...list].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.updatedAt < b.updatedAt ? 1 : -1;
  });
};

// Convert current store settings into the shape saved locally.
export const settingsSlice = (get: () => useExpensesStoreType): AppSettings => {
  const s = get();
  return {
    monthlyBudget: s.monthlyBudget,
    themeMode: s.themeMode,
    budgetAlertMonth: s.budgetAlertMonth,
  };
};

// Persist settings to AsyncStorage.
export const persistSettings = async (get: () => useExpensesStoreType) => {
  await saveSettings(settingsSlice(get));
};

// If the user is over their budget for the current month, show an alert .
export const maybeBudgetAlert = (
  get: () => useExpensesStoreType,
  set: (p: Partial<useExpensesStoreType>) => void,
) => {
  const budget = get().monthlyBudget;
  if (budget == null || budget <= 0) return;
  const ym = currentYYYYMM();
  const total = sumExpensesInMonth(get().expenses, ym);

  if (total <= budget) return;

  if (get().budgetAlertMonth !== ym) return;
  
  set({ budgetAlertMonth: ym });
  void persistSettings(get);
  Alert.alert(
    "Budget limit exceeded",
    `This month you’ve spent ${total.toFixed(2)}. Your limit is ${budget.toFixed(2)}.`,
  );
};

// Merge remote and local expenses & keep in async storage.
// Goal: keep latest version and preserve unsynced local items.
export const mergeExpenses = (
  local: Expense[],
  remote: Expense[],
): Expense[] => {
  // Index local items by id for fast lookup
  const localById = new Map(local.map((item) => [item.id, item]));

  const merged: Expense[] = [];

  // Process all remote items
  for (const remoteItem of remote) {
    const localItem = localById.get(remoteItem.id);

    // If item doesn't exist locally, it's new from server
    if (!localItem) {
      merged.push({ ...remoteItem, synced: true });
      continue;
    }

    // Remove matched local item (so remaining map = local-only items)
    localById.delete(remoteItem.id);

    // Keep whichever version is newer
    if (localItem.updatedAt > remoteItem.updatedAt) {
      merged.push(localItem);
    } else {
      merged.push({ ...remoteItem, synced: true });
    }
  }

  // Add local-only items (not present on server yet)
  for (const localItem of localById.values()) {
    merged.push(localItem);
  }

  return sortList(merged);
};


//apply filters to an expense item, used for the ExpensesListScreen search and filter feature.
export const passesFilters = (item: Expense, f: ExpenseFilters) => {
  if (f.category !== "All" && item.category !== f.category) return false;
  const q = f.query.trim().toLowerCase();
  if (q) {
    const text =
      `${item.note ?? ""} ${item.category} ${item.amount}`.toLowerCase();
    if (!text.includes(q)) return false;
  }
  if (f.dateFrom.trim() && item.date < f.dateFrom.trim()) return false;
  if (f.dateTo.trim() && item.date > f.dateTo.trim()) return false;
  return true;
}
import { Alert } from "react-native"; 
import { create } from "zustand"; 
import {
  loadExpenses,
  loadSettings,
  saveExpenses,
  saveSettings,
} from "../storage"; // Local AsyncStorage helpers.
import { pullExpenses, pushExpenses } from "../sync"; // Remote sync helpers.
import type {
  AppSettings,
  Expense,
  useExpensesStoreType,
} from "../types";
import { suggestCategoryFromNote } from "../utils/categories";
import {
  currentYYYYMM,
  sumExpensesInMonth,
  todayYYYYMMDD,
} from "../utils/date";

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Sort newest expenses first by date, then by updatedAt.
function sortList(list: Expense[]) {
  return [...list].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.updatedAt < b.updatedAt ? 1 : -1;
  });
}

// Convert current store settings into the shape saved locally.
function settingsSlice(get: () => useExpensesStoreType): AppSettings {
  const s = get();
  return {
    monthlyBudget: s.monthlyBudget,
    themeMode: s.themeMode,
    budgetAlertMonth: s.budgetAlertMonth,
  };
}

// Persist settings to AsyncStorage.
async function persistSettings(get: () => useExpensesStoreType) {
  await saveSettings(settingsSlice(get));
}

// If the user is over their budget for the current month, show an alert once.
function maybeBudgetAlert(get: () => useExpensesStoreType, set: (p: Partial<useExpensesStoreType>) => void) {
  const budget = get().monthlyBudget;
  if (budget == null || budget <= 0) return;
  const ym = currentYYYYMM();
  const total = sumExpensesInMonth(get().expenses, ym);
  if (total <= budget) return;
  if (get().budgetAlertMonth === ym) return;
  set({ budgetAlertMonth: ym });
  void persistSettings(get);
  Alert.alert(
    "Budget limit exceeded",
    `This month you’ve spent ${total.toFixed(2)}. Your limit is ${budget.toFixed(2)}.`,
  );
}

// Merge remote expenses with local state while preserving local unsynced changes.
function mergeExpenses(local: Expense[], remote: Expense[]): Expense[] {
  const localById = new Map(local.map((item) => [item.id, item]));
  const merged: Expense[] = [];

  for (const remoteItem of remote) {
    const localItem = localById.get(remoteItem.id);

    if (!localItem) {
      merged.push({ ...remoteItem, synced: true });
      continue;
    }

    localById.delete(remoteItem.id);

    if (localItem.updatedAt > remoteItem.updatedAt) {
      merged.push(localItem);
    } else {
      merged.push({ ...remoteItem, synced: true });
    }
  }

  for (const localItem of localById.values()) {
    merged.push(localItem);
  }

  return sortList(merged);
}


export const useExpensesStore = create<useExpensesStoreType>((set, get) => ({
  expenses: [],
  filters: { category: "All", query: "", dateFrom: "", dateTo: "" },
  monthlyBudget: null,
  themeMode: "system",
  budgetAlertMonth: null,

  load: async () => {
    const [rawExpenses, settings] = await Promise.all([
      loadExpenses(),
      loadSettings(),
    ]);

    const ym = currentYYYYMM();
    let budgetAlertMonth = settings.budgetAlertMonth;
    if (budgetAlertMonth && budgetAlertMonth !== ym) budgetAlertMonth = null;

    const nextSettings: AppSettings = { ...settings, budgetAlertMonth };
    await saveSettings(nextSettings);

    set({
      expenses: sortList(rawExpenses),
      monthlyBudget: settings.monthlyBudget,
      themeMode: settings.themeMode,
      budgetAlertMonth,
    });
    maybeBudgetAlert(get, set);
  },

  reload: async () => {
    await get().load();
  },

  add: async (input) => {
    const now = new Date().toISOString();
    const item: Expense = {
      id: newId(),
      amount: input.amount,
      category: input.category,
      date: input.date || todayYYYYMMDD(),
      note: input.note?.trim() ? input.note.trim() : null,
      createdAt: now,
      updatedAt: now,
      synced: false,
    };
    const next = sortList([item, ...get().expenses]);
    set({ expenses: next });
    await saveExpenses(next);
    maybeBudgetAlert(get, set);
  },

  update: async (id, input) => {
    const prev = get().expenses.find((e) => e.id === id);
    if (!prev) return;
    const item: Expense = {
      ...prev,
      amount: input.amount,
      category: input.category,
      date: input.date,
      note: input.note?.trim() ? input.note.trim() : null,
      updatedAt: new Date().toISOString(),
      synced: false,
    };
    const next = sortList(get().expenses.map((e) => (e.id === id ? item : e)));
    set({ expenses: next });
    await saveExpenses(next);
    maybeBudgetAlert(get, set);
  },

  remove: async (id) => {
    const next = get().expenses.filter((e) => e.id !== id);
    set({ expenses: next });
    await saveExpenses(next);
  },

  getById: (id) => get().expenses.find((e) => e.id === id),

  setFilters: (patch) => set({ filters: { ...get().filters, ...patch } }),
  clearFilters: () =>
    set({ filters: { category: "All", query: "", dateFrom: "", dateTo: "" } }),

  suggestCategory: (note) => suggestCategoryFromNote(note),

  setMonthlyBudget: async (value) => {
    set({ monthlyBudget: value });
    await persistSettings(get);
    maybeBudgetAlert(get, set);
  },

  setThemeMode: async (mode) => {
    set({ themeMode: mode });
    await persistSettings(get);
  },

  syncPush: async () => {
    try {
      await pushExpenses(get().expenses);
      const syncedList = get().expenses.map((item) => ({ ...item, synced: true }));
      set({ expenses: syncedList });
      await saveExpenses(syncedList);
      return { ok: true, message: "Uploaded expenses to the server." };
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : String(e) };
    }
  },

  syncPull: async () => {
    try {
      const remote = await pullExpenses();
      const next = mergeExpenses(get().expenses, remote);
      set({ expenses: next });
      await saveExpenses(next);
      maybeBudgetAlert(get, set);
      return { ok: true, message: `Imported ${next.length} expenses.` };
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : String(e) };
    }
  },

  syncNow: async () => {
    try {
      await get().syncPush();
      await get().syncPull();
    } catch {
      // Silent failure for auto-sync so offline use is not disrupted.
    }
  },
}));

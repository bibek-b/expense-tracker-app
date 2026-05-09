import { create } from "zustand";
import {
  loadExpenses,
  loadSettings,
  saveExpenses,
  saveSettings,
} from "../storage"; // Local AsyncStorage helpers.
import type { AppSettings, Expense, useExpensesStoreType } from "../types";
import {
  currentYYYYMM,
  todayYYYYMMDD,
} from "../utils/date";
import { maybeBudgetAlert, mergeExpenses, persistSettings, getNewId, sortList } from "../utils/expenseHelpers";
import { pullExpenses, pushExpenses } from "../sync";

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
      id: getNewId(),
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
      const syncedList = get().expenses.map((item) => ({
        ...item,
        synced: true,
      }));
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

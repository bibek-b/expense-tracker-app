import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppSettings, Expense } from "./types";

const EXPENSES_KEY = "expenses:v1"; // Key for local expense data storage.
const SETTINGS_KEY = "settings:v1"; // Key for local app settings.

// Sort expenses newest first by date and updatedAt.
function sortNewestFirst(list: Expense[]) {
  return [...list].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.updatedAt < b.updatedAt ? 1 : -1;
  });
}

const defaultSettings: AppSettings = {
  monthlyBudget: null,
  themeMode: "system",
  budgetAlertMonth: null,
};

// Load cached expenses from AsyncStorage.
export async function loadExpenses(): Promise<Expense[]> {
  const raw = await AsyncStorage.getItem(EXPENSES_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Save expenses to AsyncStorage with a stable sort order.
export async function saveExpenses(list: Expense[]) {
    const sorted = sortNewestFirst(list);
    await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(sorted));
}

// Load app settings from AsyncStorage.
export async function loadSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return { ...defaultSettings };
  try {
    const data = JSON.parse(raw) as Partial<AppSettings>;
    return { ...defaultSettings, ...data };
  } catch {
    return { ...defaultSettings };
  }
}

// Save app settings to AsyncStorage.
export async function saveSettings(settings: AppSettings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}



import { suggestCategoryFromNote } from "./utils/categories";

export type ExpensesStackParamList = {
  ExpensesList: undefined;
  AddEditExpense: { id?: string } | undefined;
};

export type RootTabParamList = {
  Dashboard: undefined;
  ExpensesTab: undefined;
  Settings: undefined;
};


export type ExpenseCategory =
  | "Food"
  | "Travel"
  | "Shopping"
  | "Bills"
  | "Health"
  | "Entertainment"
  | "Education"
  | "Groceries"
  | "Other";

export type Expense = {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  note: string | null;
  synced: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseInput = {
  amount: number;
  category: ExpenseCategory;
  date: string;
  note?: string;
};

export type ExpenseFilters = {
  category: ExpenseCategory | "All";
  query: string;
  dateFrom: string;
  dateTo: string;
};

export type ThemeMode = "light" | "dark" | "system";

export type AppSettings = {
  monthlyBudget: number | null;
  themeMode: ThemeMode;
  /** `YYYY-MM` when we last showed the over-budget alert (one per month). */
  budgetAlertMonth: string | null;
};

export type useExpensesStoreType = {
  expenses: Expense[];
  filters: ExpenseFilters;
  monthlyBudget: number | null;
  themeMode: ThemeMode;
  budgetAlertMonth: string | null;

  load: () => Promise<void>;
  reload: () => Promise<void>;

  add: (input: ExpenseInput) => Promise<void>;
  update: (id: string, input: ExpenseInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => Expense | undefined;

  setFilters: (patch: Partial<ExpenseFilters>) => void;
  clearFilters: () => void;
  suggestCategory: (note: string) => ReturnType<typeof suggestCategoryFromNote>;

  setMonthlyBudget: (value: number | null) => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;

  syncPush: () => Promise<{ ok: boolean; message: string }>;
  syncPull: () => Promise<{ ok: boolean; message: string }>;
  syncNow: () => Promise<void>;
};

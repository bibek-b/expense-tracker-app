import type { ExpenseCategory } from "../types";

export const CATEGORIES: ExpenseCategory[] = [
  "Food",
  "Groceries",
  "Travel",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Education",
  "Other",
];

const RULES: Array<{ match: RegExp; category: ExpenseCategory }> = [
  { match: /\b(pizza|burger|restaurant|cafe|coffee|lunch|dinner|snack)\b/i, category: "Food" },
  { match: /\b(grocery|supermarket|mart|vegetable|fruit|milk|bread)\b/i, category: "Groceries" },
  { match: /\b(bus|ticket|train|metro|cab|taxi|uber|lyft|flight|fuel|gas)\b/i, category: "Travel" },
  { match: /\b(rent|electric|water|internet|wifi|phone|bill)\b/i, category: "Bills" },
  { match: /\b(medicine|pharmacy|doctor|clinic|hospital|dentist)\b/i, category: "Health" },
  { match: /\b(movie|netflix|spotify|game|concert)\b/i, category: "Entertainment" },
  { match: /\b(course|book|tuition|class|exam)\b/i, category: "Education" },
  { match: /\b(shoes|shirt|clothes|amazon|daraz|shopping)\b/i, category: "Shopping" },
];

export function suggestCategoryFromNote(note: string | undefined | null): ExpenseCategory | null {
  const n = (note ?? '').trim();
  if (!n) return null;
  for (const r of RULES) {
    if (r.match.test(n)) return r.category;
  }
  return null;
}


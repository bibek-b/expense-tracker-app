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

const CATEGORY_KEYWORDS: Record<ExpenseCategory, string[]> = {
  Food: ["pizza", "burger", "restaurant", "dining"],
  Groceries: ["grocery", "supermarket", "food store"],
  Travel: ["bus ticket", "train ticket", "flight", "taxi"],
  Shopping: ["clothes", "electronics", "gift"],
  Bills: ["electricity", "water", "internet", "rent"],
  Health: ["medicine", "doctor", "pharmacy"],
  Entertainment: ["movie", "concert", "game"],
  Education: ["course", "book", "tuition"],
  Other: [],
};

// Function to suggest category based on note input
export function suggestCategoryFromNote(note: string): ExpenseCategory {
  const keywords = note.toLowerCase();
  for (const category of CATEGORIES) {
    const categoryKeywords = CATEGORY_KEYWORDS[category];
    if (categoryKeywords.some((kw) => keywords.includes(kw))) {
      return category;
    }
  }
  return "Other"; // Default to "Other" if no suggestion found
}

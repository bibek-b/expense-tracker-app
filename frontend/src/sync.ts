import type { Expense } from "./types";
import { BACKEND_URL } from "./config/backendUrl";

// Push expense data to the backend server.
export async function pushExpenses(expenses: Expense[]): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ expenses, updatedAt: new Date().toISOString() }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `HTTP ${res.status}`);
  }
  await res.json();
}

// Pull expense data from the backend server.
export async function pullExpenses(): Promise<Expense[]> {
  const res = await fetch(`${BACKEND_URL}/expenses`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `HTTP ${res.status}`);
  }

  const data = (await res.json()) as unknown;

  if (
    data &&
    typeof data === "object" &&
    "expenses" in data &&
    Array.isArray((data as { expenses: unknown }).expenses)
  ) {
    return (data as { expenses: Expense[] }).expenses;
  }

  throw new Error("Response must be { expenses: [] }");
}

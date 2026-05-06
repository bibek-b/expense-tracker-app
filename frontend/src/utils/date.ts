export function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export function toYYYYMMDD(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function parseYmd(ymd: string) {
  const [y, m, d] = ymd.split("-").map((x) => Number(x));
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function todayYYYYMMDD() {
  return toYYYYMMDD(new Date());
}

/** Current month as `YYYY-MM`. */
export function currentYYYYMM() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

export function monthStartYYYYMMDD(d = new Date()) {
  return toYYYYMMDD(new Date(d.getFullYear(), d.getMonth(), 1));
}

export function monthEndYYYYMMDD(d = new Date()) {
  return toYYYYMMDD(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}

export function daysInMonth(year: number, monthIndex0: number) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

/** Sum amounts for expenses whose date starts with `yyyyMm` (e.g. `2026-05`). */
export function sumExpensesInMonth(expenses: { date: string; amount: number }[], yyyyMm: string) {
  return expenses.filter((e) => e.date.startsWith(yyyyMm)).reduce((s, e) => s + e.amount, 0);
}

import { Debt } from "../components/DebtMarket/DebtMarket.types";

export const sortDebtsByName = (debts: Debt[]) =>
  [...debts].sort((a, b) => a.Name.localeCompare(b.Name));

export const sortDebtsByKey = (
  debts: Debt[],
  key: keyof Debt,
  direction: "asc" | "desc",
) => {
  return [...debts].sort((a, b) => {
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

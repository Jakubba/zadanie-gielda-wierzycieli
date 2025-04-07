import { Debt, SORT_TYPES, SortDirection } from "../types/debt.types";

export const sortDebtsByName = (debts: Debt[]): Debt[] =>
  [...debts].sort((a, b) => a.Name.localeCompare(b.Name));

export const sortDebtsByKey = (
  debts: Debt[],
  key: keyof Debt,
  direction: SortDirection,
): Debt[] => {
  return [...debts].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue < bValue) return direction === SORT_TYPES.ASC ? -1 : 1;
    if (aValue > bValue) return direction === SORT_TYPES.ASC ? 1 : -1;
    return 0;
  });
};

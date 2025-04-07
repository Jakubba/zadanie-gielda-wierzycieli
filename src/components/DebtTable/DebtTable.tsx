import React from "react";
import { Debt, SortDirection } from "../../types/debt.types";
import "./DebtTable.scss";

interface DebtTableProps {
  debts: Debt[];
  sortConfig: { key: keyof Debt; direction: SortDirection };
  handleSort: (key: keyof Debt) => void;
}

const DebtTable: React.FC<DebtTableProps> = ({
  debts,
  sortConfig,
  handleSort,
}) => {
  const columns = [
    { name: "Name", header: "Dłużnik" },
    { name: "NIP", header: "NIP" },
    { name: "Value", header: "Kwota zadłużenia" },
    { name: "Date", header: "Data powstania zobowiązania" },
  ] as const;

  const renderSortIcon = (key: keyof Debt) => {
    let additionalClass = "";
    if (sortConfig.key === key) {
      additionalClass =
        sortConfig.direction === SortDirection.ASC ? "sort-asc" : "sort-desc";
    }
    return <span className={`sort-icon ${additionalClass}`} />;
  };

  const sortedDebts = [...debts].sort((a, b) => {
    const { key, direction } = sortConfig;

    const aValue = a[key];
    const bValue = b[key];

    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return direction === SortDirection.ASC
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === SortDirection.ASC
        ? aValue - bValue
        : bValue - aValue;
    }

    if (key === "Date") {
      const aDate = new Date(aValue as string);
      const bDate = new Date(bValue as string);
      if (isNaN(aDate.getTime()) || isNaN(bDate.getTime())) return 0;
      return direction === SortDirection.ASC
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    }

    return 0;
  });

  return (
    <div className="debt-market__table-container">
      <div className="debt-market__table-wrapper">
        {debts.length === 0 ? (
          <div className="debt-market__no-results">
            <p>Nie ma takiego wierzyciela</p>
          </div>
        ) : (
          <table className="debt-market__table" data-testid="debt-table">
            <thead>
              <tr className="debt-market__table-row">
                {columns.map((column) => (
                  <th
                    key={column.name}
                    className="debt-market__table-header"
                    data-testid={`sort-header-${column.name}`}
                    onClick={() => handleSort(column.name as keyof Debt)}
                  >
                    {column.header} {renderSortIcon(column.name as keyof Debt)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedDebts.map(({ Id, Name, NIP, Value, Date: debtDate }) => (
                <tr
                  className="debt-market__table-row"
                  key={Id}
                  data-testid={`debt-row-${Id}`}
                >
                  {columns.map((column) => {
                    const cellValue =
                      column.name === "Date"
                        ? debtDate
                          ? new Date(debtDate).toLocaleDateString()
                          : "-"
                        : column.name === "Value"
                          ? (Value ?? "-")
                          : column.name === "NIP"
                            ? (NIP ?? "-")
                            : (Name ?? "-");

                    return (
                      <td className="debt-market__table-cell" key={column.name}>
                        {cellValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DebtTable;

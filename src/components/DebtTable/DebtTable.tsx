import React from "react";
import { Debt } from "../DebtMarket/DebtMarket.types.ts";
import "./DebtTable.scss";

interface DebtTableProps {
  debts: Debt[];
  sortConfig: { key: Extract<keyof Debt, string>; direction: "asc" | "desc" };
  handleSort: (key: Extract<keyof Debt, string>) => void;
}

const DebtTable: React.FC<DebtTableProps> = ({
  debts,
  sortConfig,
  handleSort,
}) => {
  // const renderSortIcon = (key: keyof Debt) => {
  //   if (sortConfig.key === key) {
  //     return sortConfig.direction === "asc" ? (
  //       <span className="sort-icon sort-asc" />
  //     ) : (
  //       <span className="sort-icon sort-desc" />
  //     );
  //   }
  //   return null;
  // };
  const renderSortIcon = (key: keyof Debt) => {
    let additionalClass = "";
    if (sortConfig.key === key) {
      additionalClass =
        sortConfig.direction === "asc" ? "sort-asc" : "sort-desc";
    }
    return <span className={`sort-icon ${additionalClass}`} />;
  };

  return (
    <div className="debt-market__table-container">
      <div className="debt-market__table-wrapper">
        {debts.length === 0 ? (
          <div className="debt-market__no-results">
            <p>Nie ma takiego wierzyciela</p>
          </div>
        ) : (
          <table className="debt-market__table">
            <thead>
              <tr className="debt-market__table-row">
                <th
                  className="debt-market__table-header"
                  onClick={() => handleSort("Name")}
                >
                  Dłużnik {renderSortIcon("Name")}
                </th>
                <th
                  className="debt-market__table-header"
                  onClick={() => handleSort("NIP")}
                >
                  NIP {renderSortIcon("NIP")}
                </th>
                <th
                  className="debt-market__table-header"
                  onClick={() => handleSort("Value")}
                >
                  Kwota zadłużenia {renderSortIcon("Value")}
                </th>
                <th
                  className="debt-market__table-header"
                  onClick={() => handleSort("Date")}
                >
                  Data powstania zobowiązania {renderSortIcon("Date")}
                </th>
              </tr>
            </thead>
            <tbody>
              {debts.map((debt) => (
                <tr className="debt-market__table-row" key={debt.Id}>
                  <td className="debt-market__table-cell">{debt.Name}</td>
                  <td className="debt-market__table-cell">{debt.NIP}</td>
                  <td className="debt-market__table-cell">{debt.Value}</td>
                  <td className="debt-market__table-cell">
                    {new Date(debt.Date).toLocaleDateString()}
                  </td>
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

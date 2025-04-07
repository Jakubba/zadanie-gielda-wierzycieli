import React from 'react';
import { Debt, SortDirection } from '../../types/debt.types';
import './DebtTable.scss';

interface DebtTableProps {
  debts: Debt[];
  sortConfig: { key: keyof Debt; direction: SortDirection };
  handleSort: (key: keyof Debt) => void;
}

const DebtTable: React.FC<DebtTableProps> = ({ debts, sortConfig, handleSort }) => {
  const columns = [
    { name: 'Name', header: 'Dłużnik' },
    { name: 'NIP', header: 'NIP' },
    { name: 'Value', header: 'Kwota zadłużenia' },
    { name: 'Date', header: 'Data powstania zobowiązania' },
  ];

  const renderSortIcon = (key: keyof Debt) => {
    let additionalClass = '';
    if (sortConfig.key === key) {
      additionalClass =
        sortConfig.direction === SortDirection.ASC ? 'sort-asc' : 'sort-desc';
    }
    return <span className={`sort-icon ${additionalClass}`} />;
  };

  return (
    <div className='debt-market__table-container'>
      <div className='debt-market__table-wrapper'>
        {debts.length === 0 ? (
          <div className='debt-market__no-results'>
            <p>Nie ma takiego wierzyciela</p>
          </div>
        ) : (
          <table className='debt-market__table'>
            <thead>
              <tr className='debt-market__table-row'>
                {columns.map((column) => (
                  <th
                    key={column.name}
                    className='debt-market__table-header'
                    onClick={() => handleSort(column.name as keyof Debt)}
                  >
                    {column.header} {renderSortIcon(column.name as keyof Debt)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {debts.map(({ Id, Name, NIP, Value, Date: debtDate }) => (
                <tr className='debt-market__table-row' key={Id}>
                  {columns.map((column) => {
                    const cellValue =
                      column.name === 'Date'
                        ? debtDate
                          ? new Date(debtDate).toLocaleDateString()
                          : '-'
                        : column.name === 'Value'
                          ? Value
                            ? Value
                            : '-'
                          : column.name === 'NIP'
                            ? NIP
                              ? NIP
                              : '-'
                            : Name
                              ? Name
                              : '-';

                    return (
                      <td className='debt-market__table-cell' key={column.name}>
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

// import React, { useEffect, useState } from 'react';
// import '../../assets/scss/reset.scss';
// import '../../assets/scss/style.scss';
// import useDebts from '../../hook/useDebt';
// import { sortDebtsByKey } from '../../utils/debtSort';
// import { Debt, SORT_TYPES, SortDirection } from '../../types/debt.types';
// import DebtTable from '../DebtTable/DebtTable';
// import Loader from '../Loader/Loader';
// import SearchInput from '../SearchInput/SearchInput';
// import Error from '../Error/Error';

// const DebtMarket: React.FC = () => {
//   const {
//     debts,
//     loading,
//     error,
//     fetchTopDebts,
//     searchDebts,
//     setDebts,
//     isFallbackToTop10,
//   } = useDebts();

//   const [searchTerm, setSearchTerm] = useState('');

//   const [sortConfig, setSortConfig] = useState<{
//     key: keyof Debt;
//     direction: SortDirection;
//   }>({
//     key: 'Name',
//     direction: SORT_TYPES.ASC,
//   });

//   useEffect(() => {
//     fetchTopDebts();
//   }, []);
//   const MIN_SEARCH_LENGTH = 3;
//   const handleSort = (key: Extract<keyof Debt, string>) => {
//     const direction =
//       sortConfig.key === key && sortConfig.direction === SORT_TYPES.ASC
//         ? SORT_TYPES.DESC
//         : SORT_TYPES.ASC;

//     setSortConfig({ key, direction });

//     const sorted = sortDebtsByKey(debts, key, direction);
//     setDebts(sorted);
//   };

//   const handleSearch = () => {
//     if (searchTerm.length < MIN_SEARCH_LENGTH) {
//       return;
//     }
//     searchDebts(searchTerm);
//   };

//   return (
//     <div className='debt-market' data-testid='debt-market'>
//       <header className='debt-market__header'>
//         <label className='debt-market__search-label'>Podaj NIP lub nazwę dłużnika</label>
//         <SearchInput
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onSearch={handleSearch}
//         />
//       </header>
//       <div className='debt-market__container'>
//         {loading && <Loader />}
//         {!loading && error && isFallbackToTop10 && <Error message={error} />}
//         {!loading && debts.length > 0 && (
//           <DebtTable debts={debts} sortConfig={sortConfig} handleSort={handleSort} />
//         )}
//         {!loading && error && debts.length === 0 && !isFallbackToTop10 && (
//           <Error message={error} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default DebtMarket;
import React, { useEffect, useState } from "react";
import "../../assets/scss/reset.scss";
import "../../assets/scss/style.scss";
import useDebts from "../../hook/useDebt";
import { sortDebtsByKey } from "../../utils/debtSort";
import { Debt, SortDirection } from "../../types/debt.types";
import DebtTable from "../DebtTable/DebtTable";
import Loader from "../Loader/Loader";
import SearchInput from "../SearchInput/SearchInput";
import Error from "../Error/Error";

const DebtMarket: React.FC = () => {
  const {
    debts,
    loading,
    error,
    fetchTopDebts,
    searchDebts,
    setDebts,
    isFallbackToTop10,
  } = useDebts();

  const [searchTerm, setSearchTerm] = useState("");
  const MIN_SEARCH_LENGTH = 3;
  const DEBOUNCE_DELAY = 500; // in ms

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Debt;
    direction: SortDirection;
  }>({
    key: "Name",
    direction: SortDirection.ASC,
  });

  useEffect(() => {
    fetchTopDebts();
  }, []);

  const handleSort = (key: Extract<keyof Debt, string>) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;

    setSortConfig({ key, direction });

    const sorted = sortDebtsByKey(debts, key, direction);
    setDebts(sorted);
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.length >= MIN_SEARCH_LENGTH) {
        searchDebts(searchTerm);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <div className="debt-market" data-testid="debt-market">
      <header className="debt-market__header">
        <label className="debt-market__search-label">
          Podaj NIP lub nazwę dłużnika
        </label>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>
      <div className="debt-market__container">
        {loading && <Loader />}
        {!loading && error && isFallbackToTop10 && <Error message={error} />}
        {!loading && debts.length > 0 && (
          <DebtTable
            debts={debts}
            sortConfig={sortConfig}
            handleSort={handleSort}
          />
        )}
        {!loading && error && debts.length === 0 && !isFallbackToTop10 && (
          <Error message={error} />
        )}
      </div>
    </div>
  );
};

export default DebtMarket;

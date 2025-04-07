import React, { useState, useEffect } from 'react';
import '../../assets/scss/reset.scss';
import '../../assets/scss/style.scss';
import { useDebts } from '../../hook/useDebt';
import { Debt, SortDirection } from '../../types/debt.types';
import DebtTable from '../DebtTable/DebtTable';
import Loader from '../Loader/Loader';
import SearchInput from '../SearchInput/SearchInput';
import Error from '../Error/Error';

const DebtMarket: React.FC = () => {
  const {
    debts,
    loading,
    search,
    resetSearch,
    setSearchTerm,
    searchTerm,
    isFallbackToTop10,
  } = useDebts();

  const [error, setError] = useState<string | null>(null);

  const MIN_SEARCH_LENGTH = 3;

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Debt;
    direction: SortDirection;
  }>({
    key: 'Name',
    direction: SortDirection.ASC,
  });

  const handleSort = (key: keyof Debt) => {
    const isSameKey = sortConfig.key === key;
    const newDirection =
      isSameKey && sortConfig.direction === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;

    setSortConfig({ key, direction: newDirection });
  };

  const sortedDebts = React.useMemo(() => {
    return [...debts].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue < bValue) return sortConfig.direction === SortDirection.ASC ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === SortDirection.ASC ? 1 : -1;
      return 0;
    });
  }, [debts, sortConfig]);

  const handleSearch = () => {
    if (searchTerm.length >= MIN_SEARCH_LENGTH) {
      search(searchTerm);
    } else {
      resetSearch();
    }
  };

  useEffect(() => {
    if (debts.length === 0 && searchTerm.length >= MIN_SEARCH_LENGTH) {
      setError('Nie znaleziono dłużnika o podanym NIP lub nazwie.');
    } else {
      setError(null);
    }
  }, [debts, searchTerm]);

  return (
    <div className='debt-market' data-testid='debt-market'>
      <header className='debt-market__header'>
        <label className='debt-market__search-label'>Podaj NIP lub nazwę dłużnika</label>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
        />
      </header>
      <div className='debt-market__container'>
        {loading && <Loader />}

        {!loading && error && !isFallbackToTop10 && <Error message={error} />}

        {!loading && (debts.length > 0 || isFallbackToTop10) && (
          <DebtTable
            debts={isFallbackToTop10 ? debts.slice(0, 10) : sortedDebts}
            sortConfig={sortConfig}
            handleSort={handleSort}
          />
        )}

        {!loading && sortedDebts.length === 0 && isFallbackToTop10 && (
          <>
            <Error
              message={error || 'Nie znaleziono dłużnika o podanym NIP lub nazwie.'}
            />
            <DebtTable
              debts={debts.slice(0, 10)}
              sortConfig={sortConfig}
              handleSort={handleSort}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DebtMarket;

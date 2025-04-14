import React, { useState, useEffect } from "react";
import "../../assets/scss/reset.scss";
import "../../assets/scss/style.scss";
import { useDebts } from "../../hook/useDebt";
import DebtTable from "../DebtTable/DebtTable";
import Loader from "../Loader/Loader";
import SearchInput from "../SearchInput/SearchInput";
import Error from "../Error/Error";

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

  const [error, setError] = useState<string>("");

  const MIN_SEARCH_LENGTH = 3;

  const handleSearch = () => {
    if (searchTerm.length >= MIN_SEARCH_LENGTH) {
      search(searchTerm);
    } else {
      resetSearch();
    }
  };

  useEffect(() => {
    if (debts.length === 0 && searchTerm.length >= MIN_SEARCH_LENGTH) {
      setError("Nie znaleziono dłużnika o podanym NIP lub nazwie.");
    } else {
      setError("");
    }
  }, [debts, searchTerm]);

  return (
    <div className="debt-market" data-testid="debt-market">
      <header className="debt-market__header">
        <label className="debt-market__search-label">
          Podaj NIP lub nazwę dłużnika
        </label>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
        />
      </header>

      <div className="debt-market__container">
        {loading ? (
          <Loader />
        ) : debts.length > 0 || isFallbackToTop10 ? (
          <>
            {error && isFallbackToTop10 && (
              <Error
                message={
                  error || "Nie znaleziono dłużnika o podanym NIP lub nazwie."
                }
              />
            )}
            <DebtTable debts={isFallbackToTop10 ? debts.slice(0, 10) : debts} />
          </>
        ) : (
          <Error message={error} />
        )}
      </div>
    </div>
  );
};

export default DebtMarket;

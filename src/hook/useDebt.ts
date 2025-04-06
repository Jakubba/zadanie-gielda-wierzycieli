import { useState } from "react";
import { Debt } from "../components/DebtMarket/DebtMarket.types";

const useDebts = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [allDebts, setAllDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFallbackToTop10, setIsFallbackToTop10] = useState(false);

  const fetchTopDebts = async (isFallback = false) => {
    setLoading(true);
    if (!isFallback) {
      setError(null);
      setIsFallbackToTop10(false);
    }
    try {
      const response = await fetch(
        "https://rekrutacja-webhosting-it.krd.pl/api/Recruitment/GetTopDebts",
      );
      const data: Debt[] = await response.json();
      const sorted = data.sort((a, b) => a.Name.localeCompare(b.Name));
      setDebts(sorted);
      setAllDebts(sorted);
      if (isFallback) {
        setIsFallbackToTop10(true);
      }
    } catch (err) {
      setError("Błąd podczas ładowania danych.");
    } finally {
      setLoading(false);
    }
  };

  const searchDebts = async (phrase: string) => {
    if (phrase.length < 3) {
      setDebts(allDebts);
      setError(null);
      setIsFallbackToTop10(false);
      return;
    }

    setLoading(true);
    setError(null);
    setIsFallbackToTop10(false);

    try {
      const response = await fetch(
        "https://rekrutacja-webhosting-it.krd.pl/api/Recruitment/GetFilteredDebts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phrase }),
        },
      );

      if (response.ok) {
        const data: Debt[] = await response.json();
        if (data.length === 0) {
          setError("Nie znaleziono dłużnika o podanym NIP lub nazwie.");
          fetchTopDebts(true);
        } else {
          setDebts(data);
        }
      } else {
        setError("Wystąpił problem podczas wyszukiwania.");
      }
    } catch (err) {
      setError("Błąd połączenia.");
    } finally {
      setLoading(false);
    }
  };

  return {
    debts,
    loading,
    error,
    isFallbackToTop10,
    fetchTopDebts,
    searchDebts,
    setDebts,
    setError,
  };
};

export default useDebts;

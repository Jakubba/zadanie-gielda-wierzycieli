import { useQuery, useMutation } from "@tanstack/react-query";
import { getTopDebts, searchDebts } from "../api/debtApi";
import { Debt } from "../types/debt.types";
import { useState } from "react";

export const useDebts = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: topDebts = [],
    isLoading,
    error,
  } = useQuery<Debt[], Error>({
    queryKey: ["topDebts"],
    queryFn: getTopDebts,
    staleTime: 1000 * 60 * 5,
  });

  const {
    mutate: search,
    data: searchResults,
    isPending: isSearching,
    error: searchError,
    reset: resetSearch,
  } = useMutation<Debt[], Error, string>({
    mutationFn: searchDebts,
  });

  const currentDebts = searchResults ?? topDebts;
  const isFallbackToTop10 = !!searchError;

  return {
    debts: currentDebts,
    loading: isLoading || isSearching,
    error: error?.message || searchError?.message || null,
    search,
    resetSearch,
    setSearchTerm,
    searchTerm,
    isFallbackToTop10,
  };
};

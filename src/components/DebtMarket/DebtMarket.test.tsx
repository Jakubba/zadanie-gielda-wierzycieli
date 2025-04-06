import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DebtMarket from "./DebtMarket";
import useDebts from "../../hook/useDebt";

jest.mock("../../hook/useDebt");

describe("DebtMarket Component", () => {
  beforeEach(() => {
    (useDebts as jest.Mock).mockReturnValue({
      debts: [
        {
          Id: 1,
          Name: "Alicja",
          NIP: "1234567890",
          Value: 1000,
          Date: "2025-01-01",
        },
        {
          Id: 2,
          Name: "Marcin",
          NIP: "9876543210",
          Value: 2000,
          Date: "2025-02-01",
        },
      ],
      loading: false,
      error: "",
      isFallbackToTop10: false,
      fetchTopDebts: jest.fn(),
      searchDebts: jest.fn(),
      setDebts: jest.fn(),
      setError: jest.fn(),
    });
  });

  it("renders debt market component", () => {
    render(<DebtMarket />);

    // Sprawdzamy, czy komponent renderuje poprawnie
    expect(screen.getByTestId("debt-market")).toBeInTheDocument();
  });

  it("displays debts correctly in table", async () => {
    render(<DebtMarket />);

    // Sprawdzamy, czy w tabeli pojawiają się poprawne dane
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(3);
    expect(rows[1]).toHaveTextContent("Alicja");
    expect(rows[2]).toHaveTextContent("Marcin");
  });

  it("handles search functionality", async () => {
    render(<DebtMarket />);

    const searchInput = screen.getByTestId("search-input");
    const searchButton = screen.getByTestId("search-button");

    // Symulowanie wpisania tekstu i kliknięcia przycisku
    fireEvent.change(searchInput, { target: { value: "Alicja" } });
    fireEvent.click(searchButton);

    // Sprawdzamy, czy funkcja wyszukiwania została wywołana
    await waitFor(() => {
      expect(useDebts().searchDebts).toHaveBeenCalledWith("Alicja");
    });
  });

  it("does not trigger search with less than 3 characters", async () => {
    render(<DebtMarket />);

    const searchInput = screen.getByTestId("search-input");
    const searchButton = screen.getByTestId("search-button");

    // Wprowadzamy mniej niż 3 znaki
    fireEvent.change(searchInput, { target: { value: "Al" } });
    fireEvent.click(searchButton);

    // Sprawdzamy, że funkcja wyszukiwania nie została wywołana
    await waitFor(() => {
      expect(useDebts().searchDebts).not.toHaveBeenCalled();
    });
  });

  it("handles loading state", () => {
    // Zmiana stanu na ładowanie
    (useDebts as jest.Mock).mockReturnValue({
      ...useDebts(),
      loading: true,
    });

    render(<DebtMarket />);

    // Sprawdzamy, czy komponent pokazuje komunikat "Ładowanie..."
    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();
  });

  it("displays error message if there is an error", () => {
    // Zmiana stanu na błąd
    (useDebts as jest.Mock).mockReturnValue({
      debts: [],
      loading: false,
      error: "Błąd ładowania danych",
      isFallbackToTop10: false,
      fetchTopDebts: jest.fn(),
      searchDebts: jest.fn(),
      setDebts: jest.fn(),
      setError: jest.fn(),
    });

    render(<DebtMarket />);

    // Upewniamy się, że komunikat o błędzie jest wyświetlany
    expect(screen.getByText("Błąd ładowania danych")).toBeInTheDocument();
  });

  it("sorts debts correctly by name", () => {
    render(<DebtMarket />);

    const nameHeader = screen.getByText("Dłużnik");

    // Kliknięcie w nagłówek tabeli, aby posortować dane po nazwie
    fireEvent.click(nameHeader);

    // Sprawdzamy, czy dane zostały posortowane poprawnie
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Alicja");
    expect(rows[2]).toHaveTextContent("Marcin");
  });

  it("handles empty debt list gracefully", async () => {
    (useDebts as jest.Mock).mockReturnValue({
      debts: [],
      loading: false,
      error: "",
      isFallbackToTop10: false,
      fetchTopDebts: jest.fn(),
      searchDebts: jest.fn(),
      setDebts: jest.fn(),
      setError: jest.fn(),
    });

    render(<DebtMarket />);

    await waitFor(() => expect(screen.queryByText("Ładowanie...")).toBeNull());

    expect(screen.queryByText("Dłużnik")).not.toBeInTheDocument();
  });

  it("displays error message if no debts found", async () => {
    (useDebts as jest.Mock).mockReturnValue({
      debts: [],
      loading: false,
      error: "Nie znaleziono dłużnika o podanym NIP lub nazwie.",
      isFallbackToTop10: false,
      fetchTopDebts: jest.fn(),
      searchDebts: jest.fn(),
      setDebts: jest.fn(),
      setError: jest.fn(),
    });

    render(<DebtMarket />);

    expect(
      screen.getByText("Nie znaleziono dłużnika o podanym NIP lub nazwie."),
    ).toBeInTheDocument();
  });

  it("handles error response when fetching debts", async () => {
    (useDebts as jest.Mock).mockReturnValue({
      debts: [],
      loading: false,
      error: "Wystąpił błąd podczas ładowania danych.",
      isFallbackToTop10: false,
      fetchTopDebts: jest.fn(),
      searchDebts: jest.fn(),
      setDebts: jest.fn(),
      setError: jest.fn(),
    });

    render(<DebtMarket />);

    await waitFor(() => expect(screen.queryByText("Ładowanie...")).toBeNull());

    expect(
      screen.getByText("Wystąpił błąd podczas ładowania danych."),
    ).toBeInTheDocument();
  });
});

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DebtMarket from './DebtMarket';
import { useDebts } from '../../hook/useDebt';

jest.mock('../../hook/useDebt');

describe('DebtMarket Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const defaultHookValues = {
    debts: [],
    loading: false,
    error: '',
    isFallbackToTop10: false,
    fetchTopDebts: jest.fn(),
    search: jest.fn(),
    resetSearch: jest.fn(),
    setSearchTerm: jest.fn(),
    searchTerm: '',
  };

  it('renders debt market component', () => {
    (useDebts as jest.Mock).mockReturnValue(defaultHookValues);
    render(<DebtMarket />);
    expect(screen.getByTestId('debt-market')).toBeInTheDocument();
  });

  it('displays debts correctly in table', () => {
    (useDebts as jest.Mock).mockReturnValue({
      ...defaultHookValues,
      debts: [
        {
          Id: 1,
          Name: 'Alicja',
          NIP: '1234567890',
          Value: 1000,
          Date: '2025-01-01',
        },
        {
          Id: 2,
          Name: 'Marcin',
          NIP: '9876543210',
          Value: 2000,
          Date: '2025-02-01',
        },
      ],
    });

    render(<DebtMarket />);
    expect(screen.getByTestId('debt-table')).toBeInTheDocument();
    expect(screen.getByText('Alicja')).toBeInTheDocument();
    expect(screen.getByText('Marcin')).toBeInTheDocument();
  });

  it('triggers search when the search button is clicked', async () => {
    const mockSearch = jest.fn();
    const mockSetSearchTerm = jest.fn();

    (useDebts as jest.Mock).mockReturnValue({
      ...defaultHookValues,
      search: mockSearch,
      setSearchTerm: mockSetSearchTerm,
      searchTerm: 'Ali',
    });

    render(<DebtMarket />);
    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'Ali' },
    });

    fireEvent.click(screen.getByTestId('search-button'));

    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith('Ali');
    });
  });

  it('does not search if input < 3 chars after clicking the search button', async () => {
    const mockSearch = jest.fn();
    const mockResetSearch = jest.fn();

    (useDebts as jest.Mock).mockReturnValue({
      ...defaultHookValues,
      search: mockSearch,
      resetSearch: mockResetSearch,
      searchTerm: 'Al',
    });

    render(<DebtMarket />);
    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'Al' },
    });

    fireEvent.click(screen.getByTestId('search-button'));

    await waitFor(() => {
      expect(mockSearch).not.toHaveBeenCalled();
      expect(mockResetSearch).toHaveBeenCalled();
    });
  });

  it('shows loading spinner', () => {
    (useDebts as jest.Mock).mockReturnValue({
      ...defaultHookValues,
      loading: true,
    });

    render(<DebtMarket />);
    expect(screen.getByText('Ładowanie...')).toBeInTheDocument();
  });

  it('shows search error when fallback is active', () => {
    (useDebts as jest.Mock).mockReturnValue({
      ...defaultHookValues,
      error: 'Nie znaleziono dłużnika o podanym NIP lub nazwie.',
      isFallbackToTop10: true,
      debts: [],
    });

    render(<DebtMarket />);
    expect(
      screen.getByText('Nie znaleziono dłużnika o podanym NIP lub nazwie.')
    ).toBeInTheDocument();
  });

  it('shows "not found" error when no results', () => {
    (useDebts as jest.Mock).mockReturnValue({
      ...defaultHookValues,
      debts: [],
      searchTerm: 'Janusz',
    });

    render(<DebtMarket />);
    expect(screen.getByText(/Nie znaleziono dłużnika/i)).toBeInTheDocument();
  });

  it('handles sort correctly on header click', async () => {
    (useDebts as jest.Mock).mockReturnValue({
      ...defaultHookValues,
      debts: [
        { Id: 2, Name: 'Zofia', NIP: '999', Value: 3000, Date: '2025-03-01' },
        { Id: 1, Name: 'Adam', NIP: '111', Value: 1000, Date: '2025-01-01' },
      ],
    });

    render(<DebtMarket />);

    const nameHeader = screen.getByTestId('sort-header-Name');
    fireEvent.click(nameHeader);

    await waitFor(() => {
      const nameCells = screen
        .getAllByTestId(/debt-row-/)
        .map((row) => row.querySelector('td:first-child'));
      expect(nameCells[0]).toHaveTextContent('Zofia');
      expect(nameCells[1]).toHaveTextContent('Adam');
    });

    fireEvent.click(nameHeader);

    await waitFor(() => {
      const nameCells = screen
        .getAllByTestId(/debt-row-/)
        .map((row) => row.querySelector('td:first-child'));
      expect(nameCells[0]).toHaveTextContent('Adam');
      expect(nameCells[1]).toHaveTextContent('Zofia');
    });
  });

  it('does not render table if no debts and not loading', () => {
    (useDebts as jest.Mock).mockReturnValue(defaultHookValues);

    render(<DebtMarket />);
    expect(screen.queryByTestId('debt-table')).not.toBeInTheDocument();
  });
});

import React from 'react';
import './SearchInput.scss';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onSearch }) => (
  <form
    className='debt-market__search'
    onSubmit={(e) => {
      e.preventDefault();
      onSearch();
    }}
  >
    <input
      className='debt-market__search-input'
      type='text'
      value={value}
      onChange={onChange}
      data-testid='search-input'
    />
    <button
      className='debt-market__search-button'
      type='submit'
      data-testid='search-button'
    >
      Szukaj
    </button>
  </form>
);

export default SearchInput;

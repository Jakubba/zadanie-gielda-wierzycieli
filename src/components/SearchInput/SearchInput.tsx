import React from "react";
import "./SearchInput.scss";
interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
}) => (
  <div className="debt-market__search">
    <input
      className="debt-market__search-input"
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={(e) => e.key === "Enter" && onSearch()}
      data-testid="search-input"
    />
    <button
      className="debt-market__search-button"
      onClick={onSearch}
      data-testid="search-button"
    >
      Szukaj
    </button>
  </div>
);

export default SearchInput;

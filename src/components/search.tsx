import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchProps {
  placeHolder: string;
  onSearchChange: (term: string) => void;
}

export const Search = ({ placeHolder, onSearchChange}: SearchProps) => {
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    onSearchChange(e.target.value);
  };

  return (
      <div className="flex items-center border-b p-2">
        <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
              d="M10.5 16C13.5376 16 16 13.5376 16 10.5C16 7.46243 13.5376 5 10.5 5C7.46243 5 5 7.46243 5 10.5C5 13.5376 7.46243 16 10.5 16Z"
              stroke="var(--gray-3)" strokeWidth="1.5"/>
          <path d="M15 15L19 19" stroke="var(--gray-3)" strokeWidth="1.5" strokeLinecap="round"
                strokeLinejoin="round"/>
        </svg>
        <input
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            placeholder={placeHolder} //
            className="outline-none text-sm w-64"
        />
      </div>
  );
};
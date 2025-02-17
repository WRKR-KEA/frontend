import { useState } from "react";

interface Search_departProps {
  placeHolder: string;
  onSearchChange: (term: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

export const Search_depart = ({ placeHolder, onSearchChange, onKeyDown, onBlur }: Search_departProps) => {
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);  // Just update the local state, no search triggered yet
  };

  return (
    <div className="flex items-center border-b p-2">
      <input
        type="text"
        value={searchInput}
        onChange={handleInputChange}  // Only update the state, no search here
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearchChange(searchInput); // Search when Enter is pressed
          }
          if (onKeyDown) onKeyDown(e);
        }}
        onBlur={() => {
          onSearchChange(searchInput); // Search when input loses focus
          if (onBlur) onBlur();
        }}
        placeholder={placeHolder}
        className="outline-none text-sm w-40"
      />
      <svg
        className="ml-2 cursor-pointer"  // Add cursor-pointer to change the mouse cursor on hover
        width="24" height="24" viewBox="0 0 24 24" fill="none"
      >
        <path
          d="M10.5 16C13.5376 16 16 13.5376 16 10.5C16 7.46243 13.5376 5 10.5 5C7.46243 5 5 7.46243 5 10.5C5 13.5376 7.46243 16 10.5 16Z"
          stroke="var(--gray-3)" strokeWidth="1.5"
        />
        <path
          d="M15 15L19 19"
          stroke="var(--gray-3)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
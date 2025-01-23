import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchProps {
  onSearchChange: (term: string) => void;
}

export const Search = ({ onSearchChange }: SearchProps) => {
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    onSearchChange(e.target.value);
  };

  return (
    <div className="flex items-center border-b p-2">
      <FaSearch className="text-gray-500 mr-2" />
      <input
        type="text"
        value={searchInput}
        onChange={handleInputChange}
        placeholder="제목, 담당자, 티켓번호"
        className="outline-none text-sm w-[130px]" 
      />
    </div>
  );
};
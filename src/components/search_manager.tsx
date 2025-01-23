import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface Search_managerProps {
  onSearchChange: (term: string) => void;
}

export const Search_manager = ({ onSearchChange }: Search_managerProps) => {
  const [searchInput, setSearchInput] = useState<string>("");

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
        placeholder="제목, 티켓번호"
        className="outline-none text-sm w-[85px]"
      />
    </div>
  );
};
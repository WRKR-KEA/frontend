import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

interface Search_managerProps {
  onSearchChange: (term: string) => void;
  searchTerm: string;
}

export const Search_manager = ({ onSearchChange, searchTerm, searchInputRef }) => {
  const [searchInput, setSearchInput] = useState(searchTerm);

  // 검색어가 변경되었을 때만 searchInput 상태를 업데이트
  useEffect(() => {
    if (searchTerm !== searchInput) {
      setSearchInput(searchTerm);
    }
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);  // 사용자가 입력하는 값 업데이트
    onSearchChange(value);   // 부모에게 검색어 전달
  };

  return (
    <div className="flex items-center border-b p-2">
      <FaSearch className="text-gray-500 mr-2" />
      <input
      ref={searchInputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="제목, 티켓번호"
        className="outline-none text-sm w-[85px]"
      />
    </div>
  );
};
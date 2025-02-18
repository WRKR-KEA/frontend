import { useState } from "react";

interface FilterNumProps {
  onSelectCount: (count: number) => void;
  selectedCount: number; // 부모에서 전달받음
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function FilterNum({ onSelectCount, selectedCount, isOpen, setIsOpen }: FilterNumProps) {
  const handleSelect = (count: number) => {
    onSelectCount(count);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 rounded px-3 py-2 text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedCount}개 표시</span>
        <svg
          className={`w-4 h-4 transform ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mr-2 w-24 bg-white border shadow-lg rounded z-50">
          <ul className="space-y-1 p-2">
            {[20, 50, 100].map((count) => (
              <li key={count}>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => handleSelect(count)}
                >
                  {count}개
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
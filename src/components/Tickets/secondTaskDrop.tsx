import { useState, useEffect } from "react";

interface SecondTaskDropProps {
  selectedRequestType: string;
  onRequestTypeChange: (value: string) => void;
  selectedService: string; 
  secondCategories:any// Now passing selectedService to adjust options dynamically
}

export default function SecondTaskDrop({
  selectedRequestType,
  onRequestTypeChange,
  selectedService,
  secondCategories,
}: SecondTaskDropProps) {
  const [isOpen, setIsOpen] = useState(false); // State to toggle the dropdown visibility

  const handleSelect = (requestType: string) => {
    onRequestTypeChange(requestType); 
    setIsOpen(false); 
  };

//   const options = getSecondTaskOptions(selectedService); 

  return (
    <div className="relative">
      <button
        className="flex items-center justify-start w-80 rounded mt-2 text-md text-gray-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src="/category_2.png"
          alt="Category Icon"
          className="w-6 h-6 mr-2"
        />
         <span className={selectedRequestType=== "2차 카테고리를 선택해주세요." ? "text-gray-500" : "text-black"}>
          {selectedRequestType}
        </span>
        <svg
          className={`w-4 h-4 transform ${isOpen ? "rotate-180" : ""} ml-auto`}
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

      <div className="w-full border-t border-gray-300 mt-2"></div>

      {isOpen && secondCategories.length > 0 && (
        <div className="absolute right-0 mt-1 w-full bg-white border shadow-lg rounded">
          <ul className="space-y-1 p-2">
            {secondCategories.map((option) => (
              <li key={option.categoryId}>
                <button
                  className={`flex items-center w-full text-left px-3 py-2 text-sm ${selectedRequestType === option ? "text-black" : "text-gray-500"} hover:bg-gray-100 hover:text-[#6E61CA]`}
                  onClick={() => handleSelect(option.name)}
                >
                  {option.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
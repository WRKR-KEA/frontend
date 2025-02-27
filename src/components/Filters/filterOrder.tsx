import { useState } from "react";

interface FilterOrderProps {
  onSelectOrder: (order: string) => void;
  sortOrder: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function FilterOrder({ onSelectOrder, sortOrder, isOpen, setIsOpen }: FilterOrderProps) {
  const [selectedOrder, setSelectedOrder] = useState(sortOrder);

  const handleSelect = (order: string) => {
    setSelectedOrder(order);
    onSelectOrder(order);
    setIsOpen(false);
  };

  const orderLabels: Record<string, string> = {
    NEWEST: "티켓 생성 순",
    OLDEST: "오래된 순",
    UPDATED: "우선순위 순",
  };

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 rounded px-2 py-2 text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{orderLabels[selectedOrder]}</span>
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
        <div className="absolute right-0 mr-2 w-28 bg-white border shadow-lg rounded z-50">
          <ul className="space-y-1 p-2">
            {["NEWEST", "OLDEST", "UPDATED"].map((order) => (
              <li key={order}>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => handleSelect(order)}
                >
                  {orderLabels[order]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";

interface FilterOrderProps {
  onSelectOrder: (order: string) => void; // order의 타입을 string으로 명시
}

export function FilterOrder({ onSelectOrder }: FilterOrderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("우선순위 순");

  const handleSelect = (order: string) => {
    setSelectedOrder(order);
    onSelectOrder(order);
    setIsOpen(false); // 선택 후 드롭다운 닫기
  };

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 rounded px-2 py-2 text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOrder}</span>
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
        <div className="absolute right-0 mr-2 w-28 bg-white border shadow-lg rounded">
          <ul className="space-y-1 p-2">
            {["최신순", "오래된 순", "우선순위 순"].map((order) => (
              <li key={order}>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => handleSelect(order)}
                >
                  {order}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

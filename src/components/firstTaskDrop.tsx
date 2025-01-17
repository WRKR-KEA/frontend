"use client"; 
import { useState } from "react";

interface FirstTaskDropProps {
  selectedService: string;
  onServiceChange: (value: string) => void;
}

export default function FirstTaskDrop({ selectedService, onServiceChange }: FirstTaskDropProps) {
  const services = [
    "인프라 (Infrastructure)",
    "시스템 (System)",
    "네트워크 (Networking)",
    "기타 (Others)"
  ];

  const [isOpen, setIsOpen] = useState(false); // State to toggle the dropdown visibility

  const handleSelect = (service: string) => {
    onServiceChange(service); // Update the selected service
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="relative">
     <button
        className="flex items-center justify-between w-80 rounded mt-2 text-sm"
        onClick={() => setIsOpen(!isOpen)}
        >
        <span>{selectedService}</span>
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
        <div className="absolute right-0 mr-2 w-80 bg-white border shadow-lg rounded">
          <ul className="space-y-1 p-2">
            {services.map((service) => (
              <li key={service}>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => handleSelect(service)}
                >
                  {service}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
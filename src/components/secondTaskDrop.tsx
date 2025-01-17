"use client"; // 클라이언트 컴포넌트로 지정
import { useState, useEffect } from "react";

interface SecondTaskDropProps {
  selectedRequestType: string;
  onRequestTypeChange: (value: string) => void;
  selectedService: string; // Now passing selectedService to adjust options dynamically
}

export default function SecondTaskDrop({
  selectedRequestType,
  onRequestTypeChange,
  selectedService,
}: SecondTaskDropProps) {
  const [isOpen, setIsOpen] = useState(false); // State to toggle the dropdown visibility

  // Options for SecondTaskDrop based on the selected service
  const getSecondTaskOptions = (service: string) => {
    switch (service) {
      case "인프라 (Infrastructure)":
        return [
          "Virtual Machine",
          "Bare Metal Server",
          "GPU",
          "Object Storage",
          "File Storage",
          "Media Convert",
        ];
      case "시스템 (System)":
        return [
          "MySQL",
          "PostgreSQL",
          "MemStore",
          "Kubernetes Engine",
          "Container Registry",
          "IAM",
          "Monitoring",
          "Cloud Trail",
          "Monitoring Flow",
          "Advanced Managed Prometheus",
          "Kubeflow",
        ];
      case "네트워크 (Networking)":
        return ["VPC", "Load Balancing", "CDN", "DNS", "Transit Gateway"];
      case "기타 (Others)":
        return [
          "OSS Library",
          "Hadoop Eco",
          "Data Catalog",
          "Data Query",
          "Pub/Sub",
          "Advanced Managed Kafka",
        ];
      default:
        return [];
    }
  };

  const handleSelect = (requestType: string) => {
    onRequestTypeChange(requestType); 
    setIsOpen(false); 
  };

  const options = getSecondTaskOptions(selectedService); 

  return (
    <div className="relative">
      <button
        className="flex items-center justify-between w-80 rounded mt-2 text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedRequestType}</span>
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

      {isOpen && options.length > 0 && (
        <div className="absolute right-0 mr-2 w-80 bg-white border shadow-lg rounded">
          <ul className="space-y-1 p-2">
            {options.map((option) => (
              <li key={option}>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
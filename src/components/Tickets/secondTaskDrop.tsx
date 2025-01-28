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

  const options = [
    "추가 (Add)",
    "수정 (Edit)",
    "삭제 (Delete)",
    "기타 (Others)"
  ];

//   const getSecondTaskOptions = (service: string) => {
//     switch (service) {
//       case "인프라 (Infrastructure)":
//         return [
//           "Virtual Machine",
//           "Bare Metal Server",
//           "GPU",
//           "Object Storage",
//           "File Storage",
//           "Media Convert",
//         ];
//       case "시스템 (System)":
//         return [
//           "MySQL",
//           "PostgreSQL",
//           "MemStore",
//           "Kubernetes Engine",
//           "Container Registry",
//           "IAM",
//           "Monitoring",
//           "Cloud Trail",
//           "Monitoring Flow",
//           "Advanced Managed Prometheus",
//           "Kubeflow",
//         ];
//       case "네트워크 (Networking)":
//         return ["VPC", "Load Balancing", "CDN", "DNS", "Transit Gateway"];
//       case "기타 (Others)":
//         return [
//           "OSS Library",
//           "Hadoop Eco",
//           "Data Catalog",
//           "Data Query",
//           "Pub/Sub",
//           "Advanced Managed Kafka",
//         ];
//       default:
//         return [];
//     }
//   };

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
        <span>{selectedRequestType}</span>
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

      {isOpen && options.length > 0 && (
        <div className="absolute right-0 mt-1 w-full bg-white border shadow-lg rounded">
          <ul className="space-y-1 p-2">
            {options.map((option) => (
              <li key={option}>
                <button
                  className={`flex items-center w-full text-left px-3 py-2 text-sm ${selectedRequestType === option ? "text-black" : "text-gray-500"} hover:bg-gray-100 hover:text-[#6E61CA]`}
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
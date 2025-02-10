import { useState ,useEffect } from "react";
import { fetchCategories } from "../../services/user"; // API 호출 함수 가져오기

interface FirstTaskDropProps {
  selectedService: string;
  onServiceChange: (value: string) => void;
  firstCategories: string[];
}

export default function FirstTaskDrop({ selectedService, onServiceChange,firstCategories }: FirstTaskDropProps) {
  const [isOpen, setIsOpen] = useState(false); // State to toggle the dropdown visibility

  // useEffect(() => {
  //   const loadCategories = async () => {
  //     try {
  //       const response = await fetchCategories();
  //       console.log("📌 가져온 카테고리 데이터:", response); // 응답 데이터 확인
  
  //       if (!response || typeof response !== "object") {
  //         console.error("⚠️ 잘못된 응답 형식:", response);
  //         setCategories([]); // 빈 배열로 초기화
  //         return;
  //       }
  
  //       if (!response.result || !Array.isArray(response.result.categories)) {
  //         console.error("⚠️ 'result' 필드가 없거나 배열이 아님:", response);
  //         setCategories([]); // 빈 배열로 초기화
  //         return;
  //       }
  
  //       // 정상적인 경우에만 데이터 설정
  //       setCategories(response.result.categories.map((category: any) => category.name));
  //     } catch (error) {
  //       console.error("❌ 카테고리 조회 실패:", error);
  //       setCategories([]); // 에러 발생 시 빈 배열 설정
  //     }
  //   };
  
  //   loadCategories();
  // }, []);
  

  const handleSelect = (service: string) => {
    onServiceChange(service); // Update the selected service
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="relative">
      <button
        className="flex items-center justify-start w-80 rounded mt-2 text-md text-gray-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src="/category_1.png"
          alt="Category Icon"
          className="w-6 h-6 mr-2"
        />
        <span>{selectedService}</span>
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

      {isOpen && (
        <div className="absolute right-0 mt-1 w-full bg-white border shadow-lg rounded">
          <ul className="space-y-1 p-2">
            {firstCategories.map((service) => (
              <li key={service}>
                <button
                  className={`flex items-center w-full text-left px-3 py-2 text-sm ${selectedService === service ? "text-black" : "text-gray-500"} hover:bg-gray-100 hover:text-[#6E61CA]`}
                  onClick={() => handleSelect(service)}
                >
                  {/* Circle with check icon */}
                  {/* <div className={`w-5 h-5 rounded-full border-2 ${selectedService === service ? "border-black" : "border-gray-500"} flex items-center justify-center mr-3 hover:border-[#6E61CA] hover:text-[#6E61CA]`}>
                    <svg
                      className={`w-3 h-3 ${selectedService === service ? "text-black" : "text-gray-500"} hover:text-[#6E61CA]`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div> */}
                <span className={`${selectedService === service} ? "text-black" : "text-gray-500"}`}>{service}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="w-full border-t border-gray-300 mt-2"></div>
        </div>
      )}
    </div>
  );
}
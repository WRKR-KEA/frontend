"use client"

import { useState, useEffect, useCallback } from "react";
import { TicketList_Manager } from "@/components/Tickets/ticketList_Manager";
import { FilterNum } from "@/components/Filters/filterNum";
import { FilterOrder } from "@/components/Filters/filterOrder";
import PagePagination from "@/components/pagination";
import { Search_manager } from "@/components/search_manager";
import Skeleton from "@/components/Skeleton";
import { useManageTicketListQuery } from "@/hooks/useManageTicketList";
import SkeletonNet from "@/components/SkeletonNet";
import SkeletonZero from "@/components/SkeletonZero"; 
import { fetchCategories } from "@/services/user";

export default function ManagerTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("UPDATED");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [selectedService, setSelectedService] = useState("1차 카테고리를 선택해주세요.");
  const [selectedSecondCategoryService, setSelectedSecondCategoryService] = useState("2차 카테고리를 선택해주세요.");
  const [firstCategories, setFirstCategories] = useState<string[]>([]);
  const [secondCategories, setSecondCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false); 
  const [isSecondCategoryOpen, setIsSecondCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState(''); 

  const handleSelect = (service: string) => {
    const selectedCategory = categories.find((category) => category.name === service);
    if (selectedCategory?.categoryId) {
      setCategoryId(selectedCategory.categoryId);
    }
    
    setSecondCategories(selectedCategory.childCategories);
    
    setSelectedService(service);
    handleFirstCategoryChange(selectedCategory?.categoryId || '');
    setIsOpen(false);
  };

  const handleSecondCategorySelect = (service: string) => {
    const selectedCategory = secondCategories.find((category) => category.name === service);
    if (selectedCategory?.categoryId) {
      setCategoryId(selectedCategory.categoryId);
    }
    
    setSelectedSecondCategoryService(service);
    handleSecondCategoryChange(selectedCategory?.categoryId || '');
    setIsSecondCategoryOpen(false);
  };

    useEffect(() => {
      const loadCategories = async () => {
        try {
          const response = await fetchCategories();
  
          if (!response || typeof response !== "object") {
            setCategories([]); // 빈 배열로 초기화
            return;
          }
  
          if (!response.result || !Array.isArray(response.result.categories)) {
            setCategories([]); // 빈 배열로 초기화
            return;
          }
  
          // 정상적인 경우에만 데이터 설정
          setCategories(response.result.categories);
          setFirstCategories(response.result.categories.map((category: any) => category.name));
        } catch (error) {
          setCategories([]); // 에러 발생 시 빈 배열 설정
        }
      };
  
      loadCategories();
    }, []);

    const handleReset = () => {
      setCategoryId('');
      setSelectedService("1차 카테고리를 선택해주세요.");
      setSelectedSecondCategoryService("2차 카테고리를 선택해주세요.");
      setSecondCategories([]);
      setCurrentPage(1);
    
      refetch();
    };

  const [tickets, setTickets] = useState<any[]>([]); // 💡 티켓 상태 추가

  const { data, isLoading, error, refetch } = useManageTicketListQuery(
    currentPage,
    maxTicketsToShow,
    sortOrder,
    selectedStatus,
    searchTerm,
    categoryId,
  );

  // 💡 data가 변경될 때 tickets 상태 업데이트
  useEffect(() => {
    if (data) {
      setTickets(data.elements);
      console.log("📌 받은 티켓 데이터:", data.elements);
    }
  }, [data]);

  // 상태 변경 시 API 데이터 다시 호출
  // categoryId 추가
  useEffect(() => {
    refetch();
  }, [selectedStatus, currentPage, maxTicketsToShow, sortOrder, searchTerm, categoryId, refetch]);

  const handleSelectCount = useCallback((count: number) => {
    setMaxTicketsToShow(count);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleSelectOrder = useCallback((order: string) => {
    setSortOrder(order);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  }, []);

  const handleFirstCategoryChange = useCallback((status: string) => {
    setCategoryId(status);
    setCurrentPage(1);
  }, []);

  const handleSecondCategoryChange = useCallback((status: string) => {
    setCategoryId(status);
    setCurrentPage(1);
  }, []);

  if (error) {
    return <SkeletonNet width="100%" height="100%" />;
  }

  const [openFilter, setOpenFilter] = useState<string | null>(null); 
const [isOrderOpen, setIsOrderOpen] = useState(false);

const toggleFilter = (filterType: string) => {
  if (openFilter === filterType) {
    setOpenFilter(null); // 이미 열려있는 필터를 클릭하면 닫기
  } else {
    setOpenFilter(filterType); // 새로운 필터 열기
  }

  if (filterType !== "filter") {
    setIsOrderOpen(false); // FilterOrder가 아닌 경우에는 그걸 닫기
  }

  if (filterType !== "num") {
    setIsOrderOpen(true); // FilterNum이 아닌 경우에는 FilterOrder를 열기
  }
};

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">티켓 조회</h2>

        <div className="flex items-center space-x-2 ml-4">
          <Search_manager
            onSearchChange={handleSearchChange} 
            placeHolder="제목, 티켓번호 검색"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                console.log("검색 실행:", searchTerm);
              }
            }}
            onBlur={() => console.log("검색어 입력 완료:", searchTerm)}
          />
        </div>

        <div className="ml-auto flex items-center">
          
    {categoryId && <button className="px-2 pt-0.5 pb-0 text-[13px] border border-gray-3 mr-1 rounded-2xl bg-white hover:bg-gray-100" onClick={handleReset}>초기화</button>}

    <div className="relative">
      <button
        className="flex items-center space-x-2 rounded px-2 py-2 text-sm"
        onClick={() => {
          setIsOpen(!isOpen);
          setIsSecondCategoryOpen(false);
        }}
      >
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

      {isOpen && (
        <div className="absolute right-0 mr-2 w-28 bg-white border shadow-lg rounded z-50 
        whitespace-nowrap max-h-80 overflow-y-auto hide-scrollbar">
          <ul className="space-y-1 p-2">
            {firstCategories.map((service) => (
              <li key={service}>
                <button
                  className={`flex items-center w-full text-left px-3 py-2 text-sm ${
                    selectedService === service ? "text-black" : "text-gray-500"
                  } hover:bg-gray-100 hover:text-[#6E61CA]`}
                  onClick={() => handleSelect(service)}
                >
                  <span>{service}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    {/* 2차 카테고리 */}
    {secondCategories.length !==0 && <div className="relative mr-3">
      <button
        disabled={secondCategories.length ===0}
        className={`flex items-center space-x-2 rounded px-2 py-2 text-sm` }
        onClick={() => {
          setIsSecondCategoryOpen(!isSecondCategoryOpen);
          setIsOpen(false);
        }}
      >
        <span>{selectedSecondCategoryService}</span>
        <svg
          className={`w-4 h-4 transform ${isSecondCategoryOpen ? "rotate-180" : ""} ml-auto`}
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

      {isSecondCategoryOpen && (
        <div className="absolute right-0 mr-2 w-28 bg-white border shadow-lg rounded z-50 
        whitespace-nowrap max-h-80 overflow-y-auto hide-scrollbar">
          <ul className="space-y-1 p-2">
            {secondCategories?.map((service) => (
              <li key={service.categoryId}>
                <button
                  className={`flex items-center w-full text-left px-3 py-2 text-sm ${
                    selectedSecondCategoryService === service.name ? "text-black" : "text-gray-500"
                  } hover:bg-gray-100 hover:text-[#6E61CA]`}
                  onClick={() => handleSecondCategorySelect(service.name)}
                >
                  <span>{service.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    } 
          <FilterOrder 
            onSelectOrder={handleSelectOrder} 
            sortOrder={sortOrder} 
            isOpen={openFilter === "filter"} 
            setIsOpen={() => toggleFilter("filter")} 
          />

          <FilterNum
            onSelectCount={handleSelectCount}
            selectedCount={maxTicketsToShow}
            isOpen={openFilter === "num"}
            setIsOpen={() => toggleFilter("num")} 
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center space-y-4">
          <Skeleton width="100%" height="600px" />
        </div>
      ) : (
        <>
          <TicketList_Manager
            tickets={tickets}
            maxTicketsToShow={maxTicketsToShow}
            searchTerm={searchTerm}
            sortOrder={sortOrder}
            currentPage={currentPage}
            totalPages={data?.totalPages || 1}
            status={selectedStatus || ""}
            onStatusChange={handleStatusChange}
            onPageChange={handlePageChange}
          />
          {data?.elements.length === 0 ? (
            <div></div>
          ) : (
            <div className="flex justify-center items-center mt-4 mb-4">
              <PagePagination
                totalItemsCount={data?.elements.length || 0}
                itemsCountPerPage={maxTicketsToShow}
                pageRangeDisplayed={5}
                currentPage={currentPage}
                totalPages={data?.totalPages || 1}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import { TicketList_Filter } from "../../../components/ticketList_Filter";
import { FilterNum } from "../../../components/filterNum"; 
import PagePagination from "../../../components/pagination"; 
import { Search } from "../../../components/search";

export default function UserTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const [dateRange, setDateRange] = useState<any>({
    startDate: null,
    endDate: null,
    key: "selection",
  });

  const handleSelectCount = (count: number) => {
    setMaxTicketsToShow(count);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // 페이지 변경 시 스크롤 맨 위로 이동
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex items-center">
        <h2 className="text-md font-semibold">티켓 조회</h2>
        
        {/* 검색 컴포넌트 추가 */}
        <div className="flex items-center space-x-4 ml-4 "> 
          <Search onSearchChange={handleSearchChange} /> 
        </div>

        <div className="ml-auto"> 
          <FilterNum onSelectCount={handleSelectCount} />
        </div>
      </div>
      
      <TicketList_Filter
        maxTicketsToShow={maxTicketsToShow}
        page={currentPage}
        searchTerm={searchTerm}
        dateRange={dateRange}
      />
      
      <div className="flex justify-center items-center mt-4">
        <PagePagination
          totalItemsCount={1000} 
          itemsCountPerPage={maxTicketsToShow}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
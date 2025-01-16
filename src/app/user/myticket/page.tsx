"use client"; // 클라이언트 컴포넌트로 지정

import { useState } from "react";
import { TicketList_Filter } from "../../../components/ticketList_Filter";
import { FilterNum } from "../../../components/filterNum"; 
import PagePagination from "../../../components/pagination"; 

export default function UserTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSelectCount = (count: number) => {
    setMaxTicketsToShow(count);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // 페이지 변경 시 스크롤 맨 위로 이동
  };

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold">티켓 조회</h2>
        <FilterNum onSelectCount={handleSelectCount} />
      </div>
      <TicketList_Filter maxTicketsToShow={maxTicketsToShow} page={currentPage} />
      
      {/* 페이지네이션 컨테이너 */}
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
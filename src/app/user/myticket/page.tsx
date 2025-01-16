"use client"; // 클라이언트 컴포넌트로 지정

import { useState } from "react";
import { TicketList } from "../../../components/ticketList";
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
        <h2 className="text-lg font-semibold">티켓 조회</h2>
        <FilterNum onSelectCount={handleSelectCount} /> {/* 필터 컴포넌트 추가 */}
      </div>
      <TicketList maxTicketsToShow={maxTicketsToShow} page={currentPage} />
      <PagePagination
        totalItemsCount={1000} // 예시로 1000개 항목으로 설정, 실제 항목 수에 맞게 변경
        itemsCountPerPage={maxTicketsToShow}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
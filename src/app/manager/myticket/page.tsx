"use client";

import { useState } from "react";
import { TicketList_Manager } from "@/components/ticketList_Manager";
import { FilterNum } from "@/components/filterNum"; 
import { FilterOrder } from "@/components/filterOrder"; 
import PagePagination from "@/components/pagination"; 
import { Search } from "@/components/search";
import { ticketDummyData } from "@/data/ticketDummyData";

export default function ManagerTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateRange, setDateRange] = useState<any>({
    startDate: null,
    endDate: null,
    key: "selection",
  });
  const [tickets, setTickets] = useState(ticketDummyData);
  const [sortOrder, setSortOrder] = useState<string>("우선순위 순");

  // Filter tickets where requester is "담당자 이름"
  const filteredTickets = tickets
    .filter((ticket) => ticket.handler === "어피치")
    .sort((a, b) => {
      if (sortOrder === "최신순") {
        return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
      } else if (sortOrder === "오래된 순") {
        return new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime();
      } else if (sortOrder === "우선순위 순") {
        if (b.ispinned && !a.ispinned) return 1;
        if (a.ispinned && !b.ispinned) return -1;
        return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
      }
      return 0;
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

  const handleSelectOrder = (order: string) => {
    setSortOrder(order);
  };

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex items-center">
        <h2 className="text-md font-semibold">티켓 조회</h2>

        {/* 검색 컴포넌트 */}
        <div className="flex items-center space-x-2 ml-4">
          <Search onSearchChange={handleSearchChange} />
        </div>

        <div className="ml-auto flex items-center ">
          {/* 필터링 컴포넌트 */}
          <FilterOrder onSelectOrder={handleSelectOrder} />
          <FilterNum onSelectCount={handleSelectCount} />
        </div>
      </div>

      <TicketList_Manager
        tickets={filteredTickets}
        maxTicketsToShow={maxTicketsToShow}
        page={currentPage}
        searchTerm={searchTerm}
        dateRange={dateRange}
      />

      <div className="flex justify-center items-center mt-4">
        <PagePagination
          totalItemsCount={filteredTickets.length}
          itemsCountPerPage={maxTicketsToShow}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
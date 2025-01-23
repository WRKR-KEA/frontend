"use client";

import { useState } from "react";
import { TicketList_Manager } from "@/components/Tickets/ticketList_Manager";
import { FilterNum } from "@/components/Filters/filterNum"; 
import { FilterOrder } from "@/components/Filters/filterOrder"; 
import PagePagination from "@/components/pagination"; 
import { ticketDummyData } from "@/data/ticketDummyData";
import { Search_manager } from "@/components/search_manager";

export default function ManagerTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });
  const [tickets, setTickets] = useState(ticketDummyData);
  const [sortOrder, setSortOrder] = useState("우선순위 순");

  // Filter tickets where requester is "담당자 이름"
  const filteredTickets = tickets.filter((ticket) => ticket.handler === "어피치");

  // Calculate paginated tickets
  const startIndex = (currentPage - 1) * maxTicketsToShow;
  const endIndex = startIndex + maxTicketsToShow;
  const paginatedTickets = filteredTickets.slice(startIndex, endIndex); // 페이지별 티켓 계산

  const handleSelectCount = (count: number) => {
    setMaxTicketsToShow(count);
    setCurrentPage(1); // 페이지 수 초기화
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
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

        <div className="flex items-center space-x-2 ml-4">
          <Search_manager onSearchChange={handleSearchChange} />
        </div>

        <div className="ml-auto flex items-center ">
          <FilterOrder onSelectOrder={handleSelectOrder} />
          <FilterNum onSelectCount={handleSelectCount} />
        </div>
      </div>

      <TicketList_Manager
        tickets={paginatedTickets}
        maxTicketsToShow={maxTicketsToShow}
        page={currentPage}
        searchTerm={searchTerm}
        dateRange={dateRange}
        sortOrder={sortOrder}
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
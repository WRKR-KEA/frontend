"use client";

import { useState } from "react";
import { TicketList_User } from "@/components/ticketList_User";
import { FilterNum } from "@/components/filterNum";
import PagePagination from "@/components/pagination";
import { Search } from "@/components/search";
import { ticketDummyData } from "@/data/ticketDummyData";

export default function UserTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateRange, setDateRange] = useState<any>({
    startDate: null,
    endDate: null,
    key: "selection",
  });

  const [tickets, setTickets] = useState(ticketDummyData);

  // 요청자가 "춘식이"인 티켓만 필터링 및 검색어와 일치하는 티켓 필터링
  const filteredTickets = tickets
    .filter((ticket) => ticket.requester === "춘식이");

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

        <div className="flex items-center space-x-4 ml-4">
          <Search onSearchChange={handleSearchChange} />
        </div>

        <div className="ml-auto">
          <FilterNum onSelectCount={handleSelectCount} />
        </div>
      </div>

      <TicketList_User
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
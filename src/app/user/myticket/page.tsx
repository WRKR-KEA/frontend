"use client";

import { useState } from "react";
import { TicketList_User } from "@/components/Tickets/ticketList_User";
import { FilterNum } from "@/components/Filters/filterNum";
import { Search } from "@/components/search";
import { ticketDummyData } from "@/data/ticketDummyData";

export default function UserTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });

  const [tickets, setTickets] = useState(ticketDummyData);

  // 요청자가 "춘식이"인 티켓만 필터링
  const filteredTickets = tickets.filter((ticket) => ticket.requester === "춘식이");

  const handleSelectCount = (count: number) => {
    setMaxTicketsToShow(count);
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
        searchTerm={searchTerm}
        dateRange={dateRange}
      />
    </div>
  );
}
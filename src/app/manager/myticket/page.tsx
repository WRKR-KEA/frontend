"use client";

import { useState } from "react";
import { TicketList_Manager } from "@/components/Tickets/ticketList_Manager";
import { FilterNum } from "@/components/Filters/filterNum";
import { FilterOrder } from "@/components/Filters/filterOrder";
import { ticketDummyData } from "@/data/ticketDummyData";
import { Search_manager } from "@/components/search_manager";

export default function ManagerTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });
  const [tickets, setTickets] = useState(ticketDummyData);
  const [sortOrder, setSortOrder] = useState("우선순위 순");

  const handleSelectCount = (count: number) => {
    setMaxTicketsToShow(count);
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
        tickets={tickets}
        maxTicketsToShow={maxTicketsToShow}
        searchTerm={searchTerm}
        dateRange={dateRange}
        sortOrder={sortOrder}
      />
    </div>
  );
}
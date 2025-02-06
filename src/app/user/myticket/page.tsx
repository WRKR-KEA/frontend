"use client";

import React, { useState } from "react";
import { TicketList_User } from "@/components/Tickets/ticketList_User";
import { FilterNum } from "@/components/Filters/filterNum";
import { Search } from "@/components/search";
import { ticketDummyData } from "@/data/ticketDummyData";
import useUserStore from "@/stores/userStore";
import { useUserTicketListQuery } from "@/hooks/useUserTicket";

type Ticket = {
  id: string;
  number: string;
  status: string;
  title: string;
  requester: string;
  requestDate: string;
  acceptDate: string | null;
  updateDate: string | null;
  completeDate: string | null;
  handler: string;
  ispinned: boolean;
};

export default function UserTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });

  const user = useUserStore((state) => state.user);
  const ticketRequester = user ? user.name : ""; // 유저가 null일 경우 빈 문자열 처리

  // 유저 티켓 리스트 가져오기
  const { data, isLoading, error } = useUserTicketListQuery({
    requester: ticketRequester,
  });

  // 티켓 데이터 변환 및 설정
  const tickets: Ticket[] = data?.elements.map((ticket: any) => ({
    id: ticket.id,
    number: ticket.serialNumber,
    status: ticket.status,
    title: ticket.title,
    requester: user?.name,
    requestDate: ticket.createdAt,
    acceptDate: ticket.startedAt || null,
    updateDate: ticket.updatedAt || null,
    completeDate: null,
    handler: ticket.managerName,
    ispinned: false,
  })) || [];

  console.log("티켓 데이터:", tickets);

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
        tickets={tickets}
        maxTicketsToShow={maxTicketsToShow}
        searchTerm={searchTerm}
        dateRange={dateRange}
      />
    </div>
  );
}
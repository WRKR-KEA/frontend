"use client";

import React, { useState, useEffect } from "react";
import { TicketList_User } from "@/components/Tickets/ticketList_User";
import { FilterNum } from "@/components/Filters/filterNum";
import { Search } from "@/components/search";
import useUserStore from "@/stores/userStore";
import { useUserTicketListQuery } from "@/hooks/useUserTicket";
import api from "@/lib/api/axios";

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

  const user = useUserStore((state) => state.user);
  const ticketRequester = user ? user.name : ""; // 유저가 null일 경우 빈 문자열 처리
  const [tickets, setTickets] = useState<Ticket[]>([]); // 요청 티켓
  const [error, setError] = useState<string | null>(null);

  // 유저 티켓 리스트 가져오기
  const { data} = useUserTicketListQuery({
    requester: ticketRequester,
  });

  // 담당자 메인 페이지 티켓 요청
const fetchTickets = async () => {
  try {
    const { data } = await api.get("/api/user/tickets/main");
    const requestTicketList: Ticket[] = data.result.recentTickets.map((ticket: any) => ({
      id: ticket.ticketId,
      number: ticket.ticketSerialNumber,
      status: ticket.status,
      title: ticket.title,
      requester: ticket.userNickname,
      handler: ticket.managerNickname,
      requestDate: ticket.requestedDate,
      updateDate: ticket.updatedDate,
      ticketTimeInfo: {
          createdAt: ticket.ticketTimeInfo.createdAt,
          updatedAt: ticket.ticketTimeInfo.updatedAt,
          startedAt: ticket.ticketTimeInfo.startedAt,
          endedAt: ticket.ticketTimeInfo.endedAt
      }
    }));

    setTickets(requestTicketList);
    console.log("🌈티켓 데이터",requestTicketList);
  } catch (error) {
    setError("티켓 정보를 불러오는 중 오류가 발생했습니다.");
  }
};

  useEffect(() => {
    fetchTickets();
  }, []);

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
          <FilterNum onSelectCount={handleSelectCount} selectedCount={maxTicketsToShow} />
        </div>
      </div>

      <TicketList_User
        tickets={tickets}
        maxTicketsToShow={maxTicketsToShow}
        searchTerm={searchTerm}
      />
    </div>
  );
}
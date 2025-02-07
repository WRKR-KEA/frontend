"use client";

import React, { useState, useEffect } from "react";
import { TicketInfo } from "@/components/Tickets/ticketInfo";
import { TicketStatus } from "@/components/Tickets/ticketStatus";
import { TicketList } from "@/components/Tickets/ticketList";
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

// Define the status types more specifically
type TicketStatusType = "new" | "rejected" | "in-progress" | "completed" | "cancelled";

// 티켓 상태 변환 맵
const statusMap: Record<string, TicketStatusType> = {
  요청: "new",
  반려: "rejected",
  진행: "in-progress",
  완료: "completed",
  취소: "cancelled",
};

export default function UserHomePage() {
  const maxTicketsToShow = 10;
  const [ticketHandler, setTicketHandler] = useState(""); // 필터링 담당자
  const [ticketStatus, setTicketStatus] = useState<TicketStatusType>("new"); 
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null); // 선택된 티켓 상태
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

  useEffect(() => {
    console.log("티켓 데이터:", tickets);
    if (tickets.length > 0 && selectedTicket === null) {
      const initialStatus = statusMap[tickets[0].status] || "new";
      setTicketStatus(initialStatus);
      setSelectedTicket(tickets[0]);
      console.log("초기 티켓의 상태:", initialStatus);
    }
  }, [tickets, selectedTicket]);

  const handleTicketClick = (ticket: Ticket) => {
    const newStatus = statusMap[ticket.status] || "new";
    setTicketStatus(newStatus);
    setSelectedTicket(ticket);
    console.log("클릭한 티켓의 상태:", newStatus);
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>티켓 정보를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <h2 className="text-md font-semibold">최근 티켓 조회</h2>
      <div className="flex space-x-6">
        {selectedTicket && <TicketInfo ticket={selectedTicket} />}
        <TicketStatus status={ticketStatus} />
      </div>
      <h2 className="text-md font-semibold">최근 티켓 현황</h2>
      <TicketList
        tickets={tickets}
        maxTicketsToShow={maxTicketsToShow}
        page={1}
        status={ticketStatus}
        handler={ticketHandler}
        requester={ticketRequester}
        onTicketClick={handleTicketClick}
      />
    </div>
  );
} 
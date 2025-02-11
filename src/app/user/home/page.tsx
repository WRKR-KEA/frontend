"use client";

import React, { useState, useEffect, useRef } from "react";
import { TicketInfo } from "@/components/Tickets/ticketInfo";
import { TicketStatus } from "@/components/Tickets/ticketStatus";
import { TicketList } from "@/components/Tickets/ticketList";
import { fetchUserTickets } from "@/service/user";

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

type TicketStatusType = "REQUEST" | "REJECT" | "IN_PROGRESS" | "COMPLETE" | "CANCEL";

const statusMap: Record<string, TicketStatusType> = {
  REQUEST: "REQUEST",
  REJECT: "REJECT",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETE: "COMPLETE",
  CANCEL: "CANCEL",
};

export default function UserHomePage() {
  const maxTicketsToShow = 10;
  const [ticketStatus, setTicketStatus] = useState<TicketStatusType>("REQUEST");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setRequestTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

   useEffect(() => {
  const fetchTickets = async () => {
    setIsLoading(true);  // 데이터 로딩 상태 시작
    try {
     const data = await fetchUserTickets();
             console.log("🌈 API 응답 데이터:", data);

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
          endedAt: ticket.ticketTimeInfo.endedAt,
        },
      }));

      setRequestTickets(requestTicketList);
    } catch (error) {
      setError("티켓 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);  // 데이터 로딩 상태 끝
    }
  };

  fetchTickets();
}, []);

  // 🌟 selectedTicket이 없을 때만 초기 상태 설정 (두 번 실행 방지)
  useEffect(() => {
    if (tickets.length > 0 && selectedTicket === null) {
      const initialStatus = statusMap[tickets[0].status] || "REQUEST";
      setTicketStatus(initialStatus);
      setSelectedTicket(tickets[0]);
      console.log("🌈 초기 티켓의 상태:", initialStatus);
    }
  }, [tickets, selectedTicket]);

  const handleTicketClick = (ticket: Ticket) => {
    const newStatus = statusMap[ticket.status] || "REQUEST";
    setTicketStatus(newStatus);
    setSelectedTicket(ticket);
    console.log("🌈 클릭한 티켓의 상태:", newStatus);
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <h2 className="text-lg font-semibold">최근 티켓 조회</h2>
      <div className="flex space-x-6">
        {selectedTicket && <TicketInfo ticket={selectedTicket} />}
        <TicketStatus status={ticketStatus} />
      </div>
      <h2 className="text-lg font-semibold">최근 티켓 현황</h2>
      <TicketList
        tickets={tickets}
        maxTicketsToShow={maxTicketsToShow}
        page={1}
        status={ticketStatus}
        onTicketClick={handleTicketClick}
      />
    </div>
  );
}
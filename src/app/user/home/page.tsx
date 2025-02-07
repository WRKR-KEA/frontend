"use client";

import React, { useState, useEffect, useRef } from "react";
import { TicketInfo } from "@/components/Tickets/ticketInfo";
import { TicketStatus } from "@/components/Tickets/ticketStatus";
import { TicketList } from "@/components/Tickets/ticketList";
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

  // 🌟 API 요청이 한 번만 실행되도록 useRef 사용
  const hasFetched = useRef(false);

  // 🌟 담당자 메인 페이지 티켓 요청 (Strict Mode에서도 두 번 실행 방지)
  const fetchTickets = async () => {
    if (hasFetched.current) return; // 두 번째 실행 방지
    hasFetched.current = true;

    setIsLoading(true);
    try {
      const { data } = await api.get("/api/user/tickets/main");
      console.log("🌈 받아온 데이터:", data.result.recentTickets);

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
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
  }, [tickets]);

  const handleTicketClick = (ticket: Ticket) => {
    const newStatus = statusMap[ticket.status] || "REQUEST";
    setTicketStatus(newStatus);
    setSelectedTicket(ticket);
    console.log("🌈 클릭한 티켓의 상태:", newStatus);
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
        onTicketClick={handleTicketClick}
      />
    </div>
  );
}
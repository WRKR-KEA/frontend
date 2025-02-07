"use client";

import React, { useState, useEffect } from "react";
import { TicketInfo } from "@/components/Tickets/ticketInfo";
import { TicketStatus } from "@/components/Tickets/ticketStatus";
import { TicketList } from "@/components/Tickets/ticketList";
import useUserStore from "@/stores/userStore";
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

// Define the status types more specifically
type TicketStatusType = "REQUEST" | "REJECT" | "IN_PROGRESS" | "COMPLETE" | "CANCEL";

// 티켓 상태 변환 맵
const statusMap: Record<string, TicketStatusType> = {
  REQUEST: "REQUEST",
  REJECT: "REJECT",
  IN_PROGRESS : "IN_PROGRESS",
  COMPLETE: "COMPLETE",
  CANCEL: "CANCEL",
};

export default function UserHomePage() {
  const maxTicketsToShow = 10;
  const [ticketStatus, setTicketStatus] = useState<TicketStatusType>("REQUEST"); 
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null); // 선택된 티켓 상태
  const user = useUserStore((state) => state.user);
  const [tickets, setRequestTickets] = useState<Ticket[]>([]); // 요청 티켓
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

// 담당자 메인 페이지 티켓 요청
const fetchTickets = async () => {
  setIsLoading(true);
  try {
    const { data } = await api.get("/api/user/tickets/main");
    console.log(data.result.recentTickets);

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

    setRequestTickets(requestTicketList);
    console.log("data",requestTicketList);
  } catch (error) {
    setError("티켓 정보를 불러오는 중 오류가 발생했습니다.");
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchTickets();
  }, []);

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
        onTicketClick={handleTicketClick}
      />
    </div>
  );
} 
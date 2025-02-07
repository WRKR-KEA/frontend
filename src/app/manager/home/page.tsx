"use client";

import React, { useState, useEffect } from "react";
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
type TicketStatusType = "new" | "rejected" | "in-progress" | "completed" | "cancelled";

// 티켓 상태 변환 맵
const statusMap: Record<string, TicketStatusType> = {
  요청: "new",
  반려: "rejected",
  진행: "in-progress",
  완료: "completed",
  취소: "cancelled",
};

export default function ManagerHomePage() {
  const maxTicketsToShow = 10;
  const user = useUserStore((state) => state.user);
  console.log(user);

  // 유저 티켓 목록 요청
  const [pinTickets, setPinTickets] = useState<Ticket[]>([]); // 핀 티켓
  const [requestTickets, setRequestTickets] = useState<Ticket[]>([]); // 요청 티켓
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 담당자 메인 페이지 티켓 요청
  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/api/manager/tickets/main");
      console.log(data);
      const pinTicketList: Ticket[] = data.result.pinTickets.map((ticket: any) => ({
        id: ticket.ticketId,
        number: ticket.ticketSerialNumber,
        status: ticket.status,
        title: ticket.title,
        requester: ticket.userNickname,
        requestDate: ticket.requestedDate,
        updateDate: ticket.updatedDate,
        handler: ticket.managerNickname,
      }));

      const requestTicketList: Ticket[] = data.result.requestTickets.map((ticket: any) => ({
        id: ticket.ticketId,
        number: ticket.ticketSerialNumber,
        status: ticket.status,
        title: ticket.title,
        requester: ticket.userNickname,
        requestDate: ticket.requestedDate,
        updateDate: ticket.updatedDate,
        handler: ticket.managerNickname,
      }));

      setPinTickets(pinTicketList);
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

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <h2 className="text-md font-semibold">고정 티켓 조회</h2>
      <TicketList
        tickets={pinTickets}
        maxTicketsToShow={maxTicketsToShow}
        page={1}
      />
      <h2 className="text-md font-semibold">최근 티켓 현황</h2>
      <TicketList
        tickets={requestTickets}
        maxTicketsToShow={maxTicketsToShow}
        page={1}
      />
    </div>
  );
}
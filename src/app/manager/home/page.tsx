"use client";

import React, { useState, useEffect } from "react";
import useUserStore from "@/stores/userStore";
import { TicketList } from "@/components/Tickets/ticektList_Manager";
import { fetchManagerTickets } from "@/services/manager";

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

export default function ManagerHomePage() {
  const maxTicketsToShow = 10;
  const user = useUserStore((state) => state.user);

  // 유저 티켓 목록 요청
  const [pinTickets, setPinTickets] = useState<Ticket[]>([]);
  const [requestTickets, setRequestTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const data = await fetchManagerTickets();
        console.log("🌟 API 응답 데이터:", data);

        if (!data || !data.result) {
          throw new Error("Invalid response format");
        }

        const pinTicketList: Ticket[] = data.result.pinTickets?.map((ticket: any) => ({
          id: ticket.ticketId,
          number: ticket.ticketSerialNumber,
          status: ticket.status,
          title: ticket.title,
          requester: ticket.userNickname,
          requestDate: ticket.requestedDate,
          updateDate: ticket.updatedDate,
          handler: ticket.managerNickname,
        })) || [];

        const requestTicketList: Ticket[] = data.result.requestTickets?.map((ticket: any) => ({
          id: ticket.ticketId,
          number: ticket.ticketSerialNumber,
          status: ticket.status,
          title: ticket.title,
          requester: ticket.userNickname,
          requestDate: ticket.requestedDate,
          updateDate: ticket.updatedDate,
          handler: ticket.managerNickname,
        })) || [];

        setPinTickets(pinTicketList);
        setRequestTickets(requestTicketList);
      } catch (error) {
        console.error("🚨 API 요청 오류:", error);
        setError("티켓 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <h2 className="text-lg font-semibold">고정 티켓 조회</h2>
      <TicketList tickets={pinTickets} maxTicketsToShow={maxTicketsToShow} page={1} />
      <h2 className="text-lg font-semibold">최근 티켓 현황</h2>
      <TicketList tickets={requestTickets} maxTicketsToShow={maxTicketsToShow} page={1} />
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { TicketInfo } from "@/components/Tickets/ticketInfo";
import { TicketStatus } from "@/components/Tickets/ticketStatus";
import { TicketList } from "@/components/Tickets/ticketList";
import Skeleton from "@/components/Skeleton";
import SkeletonNet from "@/components/SkeletonNet";
import { useUserMainTicketListQuery } from "@/hooks/useUserMainTicket";
import useUserStore from '@/stores/userStore';
import SkeletonZero from "@/components/SkeletonZero"; 

type Ticket = {
  id: string,
  number: string,
  firstCatetory: string,
  secondCatetory: string,
  status: string,
  title: string,
  handler: string,
  createdAt: string,
  updatedAt: string,
  startedAt: string,
  completedAt: string,
  requester: string,
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
  const user = useUserStore((state) => state.user);

  // ✅ React Query를 이용해 티켓 데이터 가져오기
  const { data, isLoading, error } = useUserMainTicketListQuery();
  // ✅ 티켓 데이터 상태 관리
  const [tickets, setRequestTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (data) {
      const requestTicketList: Ticket[] = data?.map((ticket: any) => ({
        id: ticket.ticketId,
        number: ticket.ticketSerialNumber,
        firstCatetory: ticket.firstCategory,
        secondCatetory: ticket.secondCategory,
        status: ticket.status,
        title: ticket.title,
        handler: ticket.managerNickname || "-",
        createdAt: ticket.ticketTimeInfo?.createdAt,
        updatedAt: ticket.ticketTimeInfo?.updatedAt || "-",
        startedAt: ticket.ticketTimeInfo?.startedAt || "-",
        completedAt: ticket.ticketTimeInfo?.endedAt || "-",      
        requester: user?.nickname,
      })) || [];
      

      setRequestTickets(requestTicketList);
      console.log("🌟 API 응답 데이터:", requestTicketList);
    }
  }, [data]);

  useEffect(() => {
    if (tickets.length > 0 && selectedTicket === null) {
      const initialStatus = statusMap[tickets[0].status] || "REQUEST";
      setTicketStatus(initialStatus);
      setSelectedTicket(tickets[0]);
      console.log("🌟 초기 티켓의 상태:", initialStatus);
    }
  }, [tickets, selectedTicket]);

  const handleTicketClick = (ticket: Ticket) => {
    const newStatus = statusMap[ticket.status] || "REQUEST";
    setTicketStatus(newStatus);
    setSelectedTicket(ticket);
    console.log("🌟 클릭한 티켓의 상태:", newStatus);
  };

  if (error) {
    return <SkeletonNet width="100%" height="100%" />;
  }

  if (tickets.length === 0) {
    return <SkeletonZero width="100%" height="100%" />;
  }

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <h2 className="text-lg font-semibold">최근 티켓 정보</h2>

      {/* 로딩 중이거나 티켓이 없을 때 스켈레톤 UI */}
      {isLoading ? (
        <div className="flex space-x-6">
          <Skeleton width="50%" height="200px" />
          <Skeleton width="50%" height="200px" />
        </div>
      ) : (
        <div className="flex space-x-6">
          {selectedTicket && <TicketInfo ticket={selectedTicket} />}
          <TicketStatus status={ticketStatus} />
        </div>
      )}

      <h2 className="text-lg font-semibold">최근 티켓 목록</h2>

      {/* 티켓 리스트 스켈레톤 UI */}
      {isLoading ? (
        <Skeleton width="100%" height="400px" />
      ) : (
        <TicketList
          tickets={tickets}
          maxTicketsToShow={maxTicketsToShow}
          page={1}
          status={ticketStatus}
          onTicketClick={handleTicketClick}
        />
      )}
    </div>
  );
}
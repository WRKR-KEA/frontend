"use client";

import React, { useState, useEffect } from "react";
import { TicketList } from "@/components/Tickets/ticketList_ManagerHome";
import Skeleton from "@/components/Skeleton";
import { useManageHomeTicketListQuery } from "@/hooks/useManageHomeTicketList";
import SkeletonNet from "@/components/SkeletonNet";

type Ticket = {
  ticketId: string;
  ticketSerialNumber: string;
  status: string;
  title: string;
  firstCategory: string;
  secondCategory: string;
  userNickname: string;
  managerNickname: string | "-";
  requestedDate: string;
  updatedDate: string;
};

export default function ManagerHomePage() {
  const maxTicketsToShow = 10;
  const { data, isLoading, error } = useManageHomeTicketListQuery();

  // 상태 추가
  const [pinTickets, setPinTickets] = useState<Ticket[]>([]);
  const [requestTickets, setRequestTickets] = useState<Ticket[]>([]);

  // data가 로드될 때마다 업데이트
  useEffect(() => {
    if (data) {
      setPinTickets(data.pinTickets || []);
      setRequestTickets(data.requestTickets || []);
    }
  }, [data]);

  if (error) {
    return <SkeletonNet width="100%" height="100%" />;
  }

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <h2 className="text-lg font-semibold">고정된 티켓</h2>
      {error || isLoading || pinTickets.length === 0 ? (
        <Skeleton width="100%" height="40%" />
      ) : (
        <TicketList tickets={pinTickets} maxTicketsToShow={maxTicketsToShow} page={1} />
      )}
      <h2 className="text-lg font-semibold">최근 티켓 요청 현황</h2>
      {error || isLoading || requestTickets.length === 0 ? (
        <Skeleton width="100%" height="40%" />
      ) : (
        <TicketList tickets={requestTickets} maxTicketsToShow={maxTicketsToShow} page={1} />
      )}
    </div>
  );
}
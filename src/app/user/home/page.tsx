"use client";

import React, { useState, useEffect } from "react";
import { TicketInfo } from "@/components/ticketInfo";
import { TicketStatus } from "@/components/ticketStatus";
import { TicketList } from "@/components/ticketList";
import { ticketDummyData } from "@/data/ticketDummyData";

export default function UserHomePage() {
  const maxTicketsToShow = 10;
  const [ticketHandler, setTicketHandler] = useState<string>(""); // 필터링 담당자
  const [ticketRequester, setTicketRequester] = useState<string>("춘식이"); // 필터링 요청자
  const [tickets, setTickets] = useState(ticketDummyData);

  // 티켓 상태 변환 맵
  const statusMap: Record<string, string> = {
    작업요청: "new", // '작업요청' -> 'new'
    반려: "rejected", // '반려' -> 'rejected'
    작업진행: "in-progress", // '작업진행' -> 'in-progress'
    작업완료: "completed", // '작업완료' -> 'completed'
    작업취소: "cancelled", // '작업취소' -> 'cancelled'
  };

  const [ticketStatus, setTicketStatus] = useState<string>("");
  const [selectedTicket, setSelectedTicket] = useState<any>(tickets[0]); // 기본 선택된 티켓은 첫 번째 티켓으로 설정

  // 컴포넌트 마운트 시 첫 번째 티켓의 상태 변환 후 상태 설정
  useEffect(() => {
    if (tickets.length > 0) {
      const initialStatus = statusMap[tickets[0].status] || tickets[0].status; // 상태 변환 맵을 사용하여 초기 상태 설정
      setTicketStatus(initialStatus);
      console.log("초기 티켓의 상태:", initialStatus); // 초기 상태 로그 출력
    }
  }, []); // 컴포넌트 마운트 시에만 실행

  const handleTicketClick = (ticket: Ticket) => {
    // 상태 변환 후 setTicketStatus 호출
    const newStatus = statusMap[ticket.status] || ticketStatus; // ticket.status로 기본 상태 설정
    setTicketStatus(newStatus); // 선택한 티켓 상태 업데이트
    setSelectedTicket(ticket); // 선택한 티켓 업데이트
    console.log("클릭한 티켓의 상태:", newStatus); // 변환된 상태를 로그로 확인
  };

  // ispinned 값이 true인 티켓만 필터링
  const pinnedTickets = tickets.filter((ticket) => ticket.ispinned);

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <h2 className="text-md font-semibold">최근 티켓 조회</h2>
      <div className="flex space-x-6">
        {/* TicketInfo에 선택된 티켓 전달 */}
        <TicketInfo ticket={selectedTicket} />
        <TicketStatus status={ticketStatus} /> {/* 선택된 티켓 상태 전달 */}
      </div>
      <h2 className="text-md font-semibold">최근 티켓 현황</h2>
      <TicketList
        tickets={pinnedTickets} // ispinned 값이 true인 티켓만 전달
        maxTicketsToShow={maxTicketsToShow}
        page={1}
        status={ticketStatus}
        handler={ticketHandler}
        requester={ticketRequester}
        onTicketClick={handleTicketClick} // 클릭 핸들러 전달
      />
    </div>
  );
}
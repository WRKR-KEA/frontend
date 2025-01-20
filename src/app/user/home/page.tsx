"use client";

import React, { useState } from 'react';
import { TicketInfo } from "../../../components/ticketInfo";
import { TicketStatus } from "../../../components/ticketStatus";
import { TicketList } from "../../../components/ticketList";

export default function UserHomePage() {
  const maxTicketsToShow = 10; // 최대 표시할 티켓 수
  const ticketStatus = 'in-progress'; //예시 상태
  const [ticketHandler, setTicketHandler] = useState<string>(''); // 필터링 담당자
  const [ticketRequester, setTicketRequester] = useState<string>(''); // 필터링 요청자

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <h2 className="text-md font-semibold">최근 티켓 조회</h2>
      <div className="flex space-x-6">
        <TicketInfo />
        <TicketStatus status={ticketStatus} /> {/* 상태를 props로 전달 */}
      </div>
      <h2 className="text-md font-semibold">최근 티켓 현황</h2>
      <TicketList 
              maxTicketsToShow={maxTicketsToShow} 
              page={1}
              status={ticketStatus} 
              handler={ticketHandler}
              requester={ticketRequester} 
            />
    </div>
  );
}
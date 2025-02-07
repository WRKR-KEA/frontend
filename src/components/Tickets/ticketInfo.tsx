import React from "react";

interface TicketInfoProps {
  ticket: {
    id: string,
    number: string,
    status: string,
    title: string,
    requester: string,
    handler: string,
    requestDate: string,
    updateDate: string | null,
    ticketTimeInfo?: { 
      createdAt: string,
      updatedAt: string | null,
      startedAt: string | null,
      endedAt: string | null
    }
  }
}

export const TicketInfo: React.FC<TicketInfoProps> = ({ ticket }) => {
  if (!ticket) {
    console.log(ticket);
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white pl-4 pt-4 pb-4 rounded-md shadow-md flex-1 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">{ticket.number} 티켓 상세 정보</h2>
      <div className="grid grid-cols-2 gap-x-8">
        <div className="space-y-4 text-left">
          <div>제목: {ticket.title}</div>
          <div>처리자: {ticket.handler}</div>
          <div>요청자: {ticket.requester}</div>
        </div>
        <div className="space-y-4 text-left">
          <div>생성 일시: {ticket.requestDate}</div>
          <div>승인 일시: {ticket.ticketTimeInfo?.startedAt}</div>
          <div>수정 일시: {ticket.updateDate}</div>
          <div>완료 일시: {ticket.ticketTimeInfo?.endedAt}</div>
        </div>
      </div>
    </div>
  );
};
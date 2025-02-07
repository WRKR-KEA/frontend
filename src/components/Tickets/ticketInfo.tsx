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
      <div className="bg-component p-4 rounded-md flex-1 max-w-4xl mx-auto min-w-96">
        <h2 className="text-md font-semibold mb-4">{ticket.number} 티켓 상세 정보</h2>
        <div className="flex justify-between gap-x-8">
          <div className="space-y-4 text-left truncate">
            {/*TODO: type으로 변경*/}
            <div className="text-sm truncate">업무: {ticket.title}</div>
            <div className="text-sm truncate">요청자: {ticket.requester}</div>
            <div className="text-sm truncate">처리자: {ticket.handler || '―'}</div>
          </div>
          <div className="space-y-4 text-left w-52 min-w-52">
            <div className="text-sm">생성 일시: {ticket.requestDate}</div>
            <div className="text-sm">승인 일시: {ticket.ticketTimeInfo.startedAt}</div>
            <div className="text-sm">수정 일시: {ticket.updateDate}</div>
            <div className="text-sm">완료 일시: {ticket.ticketTimeInfo.endedAt}</div>
          </div>
        </div>
      </div>
  );
};
import React from "react";

interface TicketInfoProps {
  ticket: {
    id: string,
    number: string,
    firstCatetory: string,
    secondCatetory: string,
    status: string,
    title: string,
    handler: string | "-",
    requester: string | "-"
    createdAt: string,
    updatedAt: string | "-",
    startedAt: string | "-",
    completedAt: string | "-",
  }
}

export const TicketInfo: React.FC<TicketInfoProps> = ({ ticket }) => {
  if (!ticket) {
    console.log("🌟 티켓: ",ticket);
    return <div>Loading...</div>;
  }

  return (
      <div className="bg-component p-4 rounded-md flex-1 max-w-4xl mx-auto min-w-96 mb-2">
        <h2 className="text-md font-semibold mb-4">{ticket.number} 티켓 상세 정보</h2>
        <div className="flex justify-between gap-x-8">
          <div className="space-y-4 text-left truncate">
            {/*TODO: type으로 변경*/}
            <div className="text-sm truncate">업무: {ticket.title}</div>
            <div className="text-sm truncate">담당자: {ticket.handler || '―'}</div>
            <div className="text-sm truncate">요청자: {ticket.requester || '―'}</div>
          </div>
          <div className="space-y-4 text-left w-52 min-w-52">
            <div className="text-sm">요청 일시: {ticket.createdAt}</div>
            <div className="text-sm">승인 일시: {ticket.startedAt}</div>
            <div className="text-sm">수정 일시: {ticket.updatedAt}</div>
            <div className="text-sm">완료 일시: {ticket.completedAt}</div>
          </div>
        </div>
      </div>
  );
};
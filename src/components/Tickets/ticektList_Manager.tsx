import React from "react";

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

type TicketListProps = {
  tickets: Ticket[];
  maxTicketsToShow: number;
  page: number;
  status?: string;
  onTicketClick?: (ticket: Ticket) => void;
};

export function TicketList({
  tickets,
  maxTicketsToShow,
  page,
  onTicketClick,
}: TicketListProps) {
  console.log("받은 티켓 데이터:", tickets);

  const statusStyles: Record<string, string> = {
    COMPLETE: "bg-[#D1EEE2] text-[#3A966F]",
    IN_PROGRESS: "bg-[#CFE3FF] text-[#3E7DD6]",
    CANCEL: "bg-[#E0E0E0] text-[#767676]",
    REJECT: "bg-[#F3CDBE] text-[#DE6231]",
    REQUEST: "bg-[#FFE9B6] text-[#D79804]",
  };

  const statusMap: Record<string, string> = {
    REQUEST: "REQUEST",
    REJECT: "REJECT",
    IN_PROGRESS : "IN_PROGRESS",
    COMPLETE: "COMPLETE",
    CANCEL: "CANCEL",
  };

  // 티켓을 페이지에 맞게 잘라서 표시
  const startIndex = (page - 1) * maxTicketsToShow;
  const endIndex = startIndex + maxTicketsToShow;
  const displayedTickets = tickets.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-md shadow-md">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 w-24 border">티켓 번호</th>
            <th className="p-2 w-20 border">상태</th>
            <th className="p-2 w-40 border">제목</th>
            <th className="p-2 w-24 border">요청자</th>
            <th className="p-2 w-32 border">요청일</th>
            <th className="p-2 w-32 border">최근 업데이트일</th>
          </tr>
        </thead>
        <tbody>
          {displayedTickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-b cursor-pointer hover:bg-gray-100"
              onClick={() => onTicketClick?.(ticket)}
            >
              <td className="p-2 border">{ticket.number}</td>
              <td className="p-2 border">
                <span
                  className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${
                    statusStyles[statusMap[ticket.status]] || ""
                  }`}
                >
                  {ticket.status}
                </span>
              </td>
              <td className="p-2 border">{ticket.title}</td>
              <td className="p-2 border">{ticket.requester}</td>
              <td className="p-2 border">{ticket.requestDate}</td>
              <td className="p-2 border">{ticket.updateDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
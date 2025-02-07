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
  handler?: string;
  requester?: string;
  ispinned?: boolean;
  onTicketClick?: (ticket: Ticket) => void;
};

export function TicketList({
  tickets,
  maxTicketsToShow,
  page,
  status,
  handler,
  requester,
  onTicketClick,
}: TicketListProps) {
  console.log("받은 티켓 데이터:", tickets);

  const statusStyles: Record<string, string> = {
    작업완료: "bg-[#D1EEE2] text-[#3A966F]",
    작업진행: "bg-[#CFE3FF] text-[#3E7DD6]",
    작업취소: "bg-[#E0E0E0] text-[#767676]",
    반려: "bg-[#F3CDBE] text-[#DE6231]",
    작업요청: "bg-[#FFE9B6] text-[#D79804]",
  };

  const statusMap: Record<string, string> = {
    요청: "작업요청",
    반려: "반려",
    진행: "작업진행",
    완료: "작업완료",
    취소: "작업취소",
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
            <th className="p-2 border">티켓 번호</th>
            <th className="p-2 border">상태</th>
            <th className="p-2 border">제목</th>
            <th className="p-2 border">담당자</th>
            <th className="p-2 border">요청자</th>
            <th className="p-2 border">요청일</th>
            <th className="p-2 border">최근 업데이트일</th>
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
              <td className="p-2 border">{ticket.handler}</td>
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
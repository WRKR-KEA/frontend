import React from "react";

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
  const statusStyles: Record<string, string> = {
    COMPLETE: "bg-complete text-complete",
    IN_PROGRESS: "bg-inProgress text-inProgress",
    CANCEL: "bg-cancel text-cancel",
    REJECT: "bg-reject text-reject",
    REQUEST: "bg-request text-request",
  };

  // 티켓을 페이지에 맞게 잘라서 표시
  const startIndex = (page - 1) * maxTicketsToShow;
  const endIndex = startIndex + maxTicketsToShow;
  const displayedTickets = tickets.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-md">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-6 text-left border-b border-gray-4">
            <th className="px-4 py-2 w-32 min-w-32 text-center">티켓 번호</th>
            <th className="px-4 py-2 w-24 min-w-24 text-center">상태</th>
            <th className="px-4 py-2 w-36 min-w-36 text-center">카테고리</th>
            <th className="px-4 py-2 w-60 max-w-60 text-center">제목</th>
            <th className="px-4 py-2 w-24 min-w-24 text-center">담당자</th>
            <th className="px-4 py-2 w-40 min-w-40 text-center">최근 변경 일시</th>
          </tr>
        </thead>
        <tbody>
          {displayedTickets.map((ticket, index) => (
            <tr
              key={ticket.id ?? `ticket-${index}`} 
              className="border-b cursor-pointer hover:bg-gray-100"
              onClick={() => onTicketClick?.(ticket)}
            >
              <td className="px-4 py-2 border truncate text-center">{ticket.number}</td>
              <td className="px-4 py-2 border truncate text-center">
                <span
                  className={`inline-block px-2 py-1 border rounded-md truncate text-xs font-semibold ${statusStyles[ticket.status]}`}
                >
                  {ticket.status}
                </span>
              </td>
              <td className="px-4 py-2 border truncate text-center">
                {ticket.firstCatetory}/{ticket.secondCatetory}
              </td>
              <td className="px-4 py-2 border max-w-60 truncate">{ticket.title}</td>
              <td className="px-4 py-2 border truncate text-center">{ticket.handler}</td>
              <td className="px-4 py-2 border truncate text-center">{ticket.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
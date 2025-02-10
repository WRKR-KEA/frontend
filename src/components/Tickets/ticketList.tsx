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
  const statusStyles: Record<string, string> = {
    COMPLETE: "bg-complete text-complete",
    IN_PROGRESS: "bg-inProgress text-inProgress",
    CANCEL: "bg-cancel text-cancel",
    REJECT: "bg-reject text-reject",
    REQUEST: "bg-request text-request",
  };

  const statusMap: Record<string, string> = {
    REQUEST: "작업 요청",
    CANCEL: "취소",
    IN_PROGRESS : "작업 진행",
    REJECT: "반려",
    COMPLETE: "작업 완료",
  };

  // 티켓을 페이지에 맞게 잘라서 표시
  const startIndex = (page - 1) * maxTicketsToShow;
  const endIndex = startIndex + maxTicketsToShow;
  const displayedTickets = tickets.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-md shadow-md">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-6 text-left border-b border-gray-4">
            <th className="px-4 py-2 w-20 min-w-20">티켓 번호</th>
            <th className="px-4 py-2 w-24 min-w-24 text-center">상태</th>
            <th className="px-4 py-2 w-80">제목</th>
            <th className="px-4 py-2 w-32 min-w-32">담당자</th>
            <th className="px-4 py-2 w-32 min-w-32">요청자</th>
            <th className="px-4 py-2 w-44 min-w-44">요청일</th>
            <th className="px-4 py-2 w-44 min-w-44">최근 변경일</th>
          </tr>
        </thead>
        <tbody>
          {displayedTickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-t border-gray-5 cursor-pointer hover:bg-gray-100"
              onClick={() => onTicketClick?.(ticket)}
            >
              <td className="px-4 py-2">{ticket.number}</td>
              <td className="px-4 py-2 text-center">
                <span
                    className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${statusStyles[ticket.status]}`}
                >
                  {statusMap[ticket.status]}
                </span>
              </td>
              <td className="px-4 py-2 truncate">{ticket.title}</td>
              <td className="px-4 py-2 truncate">{ticket.handler}</td>
              <td className="px-4 py-2 truncate">{ticket.requester}</td>
              <td className="px-4 py-2">{ticket.requestDate}</td>
              <td className="px-4 py-2">{ticket.updateDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
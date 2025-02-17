import { useRouter } from "next/navigation";
import React from "react";

type Ticket = {
  id: string,
  number: string,
  firstCategory: string,
  secondCategory: string,
  status: string,
  title: string,
  handler: string,
  requestDate: string,
  updateDate: string,
  acceptDate: string,
  completeDate: string,
};

type TicketListProps = {
  tickets: Ticket[];
  maxTicketsToShow: number;
  page: number;
  status?: string;
  onTicketHover?: (ticket: Ticket) => void;
};

export function TicketList({
  tickets,
  maxTicketsToShow,
  page,
  onTicketHover,
}: TicketListProps) {
  const statusStyles: Record<string, string> = {
    COMPLETE: "bg-complete text-complete",
    IN_PROGRESS: "bg-inProgress text-inProgress",
    CANCEL: "bg-cancel text-cancel",
    REJECT: "bg-reject text-reject",
    REQUEST: "bg-request text-request",
  };

  const router = useRouter();

  // 티켓을 페이지에 맞게 잘라서 표시
  const startIndex = (page - 1) * maxTicketsToShow;
  const endIndex = startIndex + maxTicketsToShow;
  const displayedTickets = tickets.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-md">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-6 text-left border-b border-gray-4">
            <th className="px-4 py-2 w-28 max-w-28 text-center">티켓 번호</th>
            <th className="px-4 py-2 w-28 max-w-28 text-center">상태</th>
            <th className="px-4 py-2 w-28 max-w-28 text-center">카테고리</th>
            <th className="px-4 py-2 w-80 max-w-80 text-center">제목</th>
            <th className="px-4 py-2 w-28 max-w-28 text-center">담당자</th>
            <th className="px-4 py-2 w-32 max-w-32 text-center">최근 변경 일시</th>
          </tr>
        </thead>
        <tbody>
          {displayedTickets.map((ticket, index) => (
            <tr
              key={ticket.id ?? `ticket-${index}`} 
              className="border-b cursor-pointer hover:bg-gray-100"
              onMouseEnter={() => onTicketHover?.(ticket)}
              onClick={()=>router.push(`/user/myticket/${ticket.id}`)}
            >
              <td className="px-4 py-2 max-w-28 border truncate text-center">{ticket.number}</td>
              <td className="px-4 py-2 max-w-28 border text-center">
                <p
                  className={`max-w-fit px-2 py-1 border rounded-md truncate text-xs font-semibold mx-auto ${statusStyles[ticket.status]}`}
                >
                  {ticket.status}
                </p>
              </td>
              <td className="px-4 py-2 max-w-28 border truncate text-center">
                {ticket.firstCategory}/{ticket.secondCategory}
              </td>
              <td className="px-4 py-2 border max-w-80 truncate">{ticket.title}</td>
              <td className="px-4 py-2 border max-w-28 truncate text-center">{ticket.handler}</td>
              <td className="px-4 py-2 border max-w-32 truncate text-center">{ticket.updateDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
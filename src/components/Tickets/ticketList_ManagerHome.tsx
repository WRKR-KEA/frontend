import { useRouter } from "next/navigation";
import React from "react";

type Ticket = {
  ticketId: string;
  ticketSerialNumber: string;
  status: string;
  title: string;
  firstCategory: string;
  secondCategory: string;
  userNickname: string;
  managerNickname: string | "-";
  requestedDate: string;
  updatedDate: string;
};

type TicketListProps = {
  tickets: Ticket[];
  maxTicketsToShow: number;
  page: number;
  onTicketHover?: (ticket: Ticket) => void;
  showUpdateDate: boolean;
  showRequestDate: boolean;
};

export function TicketList({
  tickets,
  maxTicketsToShow,
  page,
  onTicketHover,
  showUpdateDate,
  showRequestDate,
}: TicketListProps) {
  const statusStyles: Record<string, string> = {
    COMPLETE: "bg-complete text-complete",
    IN_PROGRESS: "bg-inProgress text-inProgress",
    CANCEL: "bg-cancel text-cancel",
    REJECT: "bg-reject text-reject",
    REQUEST: "bg-request text-request",
  };

  const statusLabels: Record<string, string> = {
    COMPLETE: "완료",
    IN_PROGRESS: "진행",
    CANCEL: "취소",
    REJECT: "반려",
    REQUEST: "요청",
  };

  const router = useRouter();

  const startIndex = (page - 1) * maxTicketsToShow;
  const endIndex = startIndex + maxTicketsToShow;
  const displayedTickets = tickets.slice(startIndex, endIndex);

  const handleTicketClick = (ticket: Ticket) => {
    if (showUpdateDate) {
      router.push(`/manager/myticket/${ticket.ticketId}`);
    } else if (showRequestDate) {
      router.push(`/manager/departmentticket/${ticket.ticketId}`);
    }
  };

  return (
    <div className="bg-white rounded-md">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-6 text-left border-b border-gray-4">
            <th className="px-4 py-2 w-32 text-center">티켓 번호</th>
            <th className="px-4 py-2 w-20 text-center">상태</th>
            <th className="px-4 py-2 w-32 text-center">카테고리</th>
            <th className="px-4 py-2 w-80 text-center">제목</th>
            {showUpdateDate && (
              <th className="px-4 py-2 w-32 text-center">담당자</th>
            )}
            {showUpdateDate && (
              <th className="px-4 py-2 w-36 text-center">최근 변경 일시</th>
            )}
            {showRequestDate && (
              <th className="px-4 py-2 w-36 text-center">요청 일시</th>
            )}
          </tr>
        </thead>
        <tbody>
          {displayedTickets.map((ticket, index) => (
            <tr
              key={ticket.ticketId ?? `ticket-${index}`}
              className="border-b cursor-pointer h-[42px] hover:bg-gray-100"
              onMouseEnter={() => onTicketHover?.(ticket)}
              onClick={() => handleTicketClick(ticket)}
            >
              <td className="px-4 py-2 border truncate text-center">
                {ticket.ticketSerialNumber}
              </td>
              <td className="px-4 py-2 border text-center">
                <p
                  className={`max-w-fit px-2 py-1 border rounded-md truncate text-xs font-semibold mx-auto ${statusStyles[ticket.status]}`}
                >
                  {statusLabels[ticket.status] ?? ticket.status}
                </p>
              </td>
              <td className="px-4 py-2 border truncate text-center">
                {ticket.firstCategory}/{ticket.secondCategory}
              </td>
              <td className="px-4 py-2 border truncate">{ticket.title}</td>
              {showUpdateDate && (
                <td className="px-4 py-2 border truncate text-center">
                  {ticket.managerNickname}
                </td>
              )}
              {showUpdateDate && (
                <td className="px-4 py-2 border truncate text-center">
                  {ticket.updatedDate}
                </td>
              )}
              {showRequestDate && (
                <td className="px-4 py-2 border max-w-32 truncate text-center">
                  {ticket.requestedDate}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
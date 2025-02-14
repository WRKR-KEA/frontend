import React from "react";
import { useRouter } from "next/navigation";

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
  status?: string;
  onTicketClick?: (ticket: Ticket) => void;
};

export function TicketList({
  tickets,
  maxTicketsToShow,
  page,
}: TicketListProps) {
  console.log("받아온 티켓:", tickets);
  const statusStyles: Record<string, string> = {
    COMPLETE: "bg-[#D1EEE2] text-[#3A966F]",
    IN_PROGRESS: "bg-[#CFE3FF] text-[#3E7DD6]",
    CANCEL: "bg-[#E0E0E0] text-[#767676]",
    REJECT: "bg-[#F3CDBE] text-[#DE6231]",
    REQUEST: "bg-[#FFE9B6] text-[#D79804]",
  };

  // 티켓을 페이지에 맞게 잘라서 표시
  const startIndex = (page - 1) * maxTicketsToShow;
  const endIndex = startIndex + maxTicketsToShow;
  const displayedTickets = tickets.slice(startIndex, endIndex);
  const router = useRouter();

  const handleTicketClick = (ticket: Ticket) => {
    if (ticket.status === "REQUEST") 
      router.push(`/manager/departmentticket/${ticket.ticketId}`);
    else
      router.push(`/manager/myticket/${ticket.ticketId}`);
  };

  return (
    <div className="bg-white rounded-md">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-6 text-left border-b border-gray-4">
            <th className="p-2 w-28 max-w-28 border text-center">티켓 번호</th>
            <th className="p-2 w-28 max-w-28 border text-center">상태</th>
            <th className="p-2 w-80 max-w-80 border text-center">제목</th>
            <th className="p-2 w-28 max-w-28 border text-center">요청자</th>
            <th className="p-2 w-28 max-w-28 border text-center">요청일</th>
            <th className="p-2 w-32 max-w-32 border text-center">최근 업데이트일</th>
          </tr>
        </thead>
        <tbody>
          {displayedTickets.map((ticket) => (
            <tr
              key={ticket.ticketId}
              className="border-b cursor-pointer hover:bg-gray-100"
              onClick={() => handleTicketClick(ticket)}
            >
              <td className="p-2 border max-w-28 truncate text-center">{ticket.ticketSerialNumber}</td>
              <td className="p-2 border max-w-28 truncate text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${
                    statusStyles[ticket.status] || ""
                  }`}
                >
                  {ticket.status}
                </span>
              </td>
              <td className="p-2 border max-w-80 truncate">{ticket.title}</td>
              <td className="p-2 border max-w-28 truncate text-center">{ticket.userNickname}</td>
              <td className="p-2 border max-w-28 truncate text-center">{ticket.requestedDate}</td>
              <td className="p-2 border max-w-32 truncate text-center">{ticket.updatedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
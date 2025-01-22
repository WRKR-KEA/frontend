import React from 'react';

type Ticket = {
  id: string;
  number: string;
  status: string;
  title: string;
  requester: string;
  requestDate: string;
  updateDate: string;
  handler: string;
};

type TicketListProps = {
  tickets: Ticket[]; // 데이터를 props로 받음
  maxTicketsToShow: number;
  page: number;
  status?: string;
  handler?: string;
  requester?: string;
  onTicketClick?: (ticket: Ticket) => void; // 티켓 클릭 핸들러
};

export function TicketList({
  tickets,
  maxTicketsToShow,
  page,
  status,
  handler,
  requester,
  onTicketClick
}: TicketListProps) {
  const statusStyles: Record<string, string> = {
    작업완료: "bg-[#D1EEE2] text-[#3A966F]",
    작업진행: "bg-[#CFE3FF] text-[#3E7DD6]",
    작업취소: "bg-[#E0E0E0] text-[#767676]",
    반려: "bg-[#F3CDBE] text-[#DE6231]",
    작업요청: "bg-[#FFE9B6] text-[#D79804]",
  };

  // 필터링 로직
  const filteredTickets = tickets.filter((ticket) => {
    return (
      (!handler || ticket.handler.toLowerCase().includes(handler.toLowerCase())) &&
      (!requester || ticket.requester.toLowerCase().includes(requester.toLowerCase()))
    );
  });

  // 페이지에 해당하는 티켓들을 잘라서 표시
  const displayedTickets = filteredTickets.slice(
    (page - 1) * maxTicketsToShow,
    page * maxTicketsToShow
  );

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
              onClick={() => {
                console.log("티켓 클릭됨", ticket); 
                onTicketClick?.(ticket);
              }}
            >
              <td className="p-2 border">{ticket.number}</td>
              <td className="p-2 border">
                <span
                  className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${
                    statusStyles[ticket.status] || ""
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
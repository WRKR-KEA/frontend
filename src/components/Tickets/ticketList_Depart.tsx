import React, { useState, useEffect } from 'react';
import { FilterTab } from '@/components/Filters/filterTab';
import { useRouter } from 'next/navigation';
import { HighlightText } from '@/components/highlightText';

type Ticket = {
  ticketId: string;
  ticketSerialNumber: string;
  status: string;
  title: string;
  userNickname: string;
  managerNickname: string;
  requestedDate: string;
  updatedDate: string;
};

type TicketList_DepartProps = {
  tickets: Ticket[];
  maxTicketsToShow: number;
  page: number;
  searchTerm: string;
  dateRange: { startDate: Date | null; endDate: Date | null };
  onStatusChange: (status: string) => void;
  status: string;
};

export function TicketList_Depart({
  tickets,
  maxTicketsToShow,
  page,
  searchTerm,
  dateRange,
  onStatusChange,
  status,
}: TicketList_DepartProps) {
  const statusStyles: Record<string, string> = {
    REQUEST: 'bg-request text-request',
    IN_PROGRESS: 'bg-inProgress text-inProgress',
    COMPLETE: 'bg-complete text-complete',
    CANCEL: 'bg-cancel text-cancel',
    REJECT: 'bg-reject text-reject',
  };
console.log("🌟 받은 티켓 데이터:",tickets);

  const [currentPage, setCurrentPage] = useState(page);
  const [activeTab, setActiveTab] = useState(status);
  const router = useRouter();

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    onStatusChange(tab);
  };

  const handleTicketClick = (ticketId: string) => {
    const currentPath = window.location.pathname;
    router.push(`${currentPath}/${ticketId}`);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearchTerm =
      ticket.title.includes(searchTerm) ||
      ticket.ticketSerialNumber.includes(searchTerm) ||
      ticket.userNickname.includes(searchTerm) ||
      ticket.managerNickname?.includes(searchTerm);
  
    const matchesDateRange =
      !dateRange.startDate ||
      !dateRange.endDate ||
      (new Date(ticket.requestedDate) >= dateRange.startDate &&
        new Date(ticket.requestedDate) <= dateRange.endDate);
  
    const matchesStatus = status === "" || ticket.status === status; // Filter by status
  
    return matchesSearchTerm && matchesDateRange && matchesStatus; // Apply status filter here
  });

  return (
    <div className="bg-white rounded-md">
      <FilterTab activeTab={activeTab} handleTabClick={handleTabClick} />
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-6 text-left border-b border-gray-4">
            <th className="px-4 py-2 w-20 min-w-20 text-center">티켓 번호</th>
            <th className="px-4 py-2 w-24 min-w-24 text-center">상태</th>
            <th className="px-4 py-2 w-76">제목</th>
            <th className="px-4 py-2 w-28 min-w-32 text-center">담당자</th>
            <th className="px-4 py-2 w-28 min-w-32 text-center">요청자</th>
            <th className="px-4 py-2 w-32 min-w-32 text-center">요청일시</th>
            <th className="px-4 py-2 w-32 min-w-32 text-center">최근 변경일시</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((ticket) => (
            <tr
              key={ticket.ticketId}
              className="border-t border-gray-5 cursor-pointer"
              onClick={() => handleTicketClick(ticket.ticketId)}
            >
              <td className="px-4 py-2 w-20 text-center">
                <HighlightText text={ticket.ticketSerialNumber} highlight={searchTerm} />
              </td>
              <td className="px-4 py-2 w-24 text-center">
                <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusStyles[ticket.status]}`}>
                  {ticket.status}
                </span>
              </td>
              <td className="px-4 py-2 w-60 truncate">
                <HighlightText text={ticket.title} highlight={searchTerm} />
              </td>
              <td className="px-4 py-2 w-28 text-center truncate">{ticket.managerNickname}</td>
              <td className="px-4 py-2 w-28 text-center truncate">{ticket.userNickname}</td>
              <td className="px-4 py-2 w-32 text-center">{ticket.requestedDate}</td>
              <td className="px-4 py-2 w-32 text-center">{ticket.updatedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
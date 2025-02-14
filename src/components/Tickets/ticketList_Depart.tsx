import React, { useState, useEffect } from 'react';
import { FilterTab } from '@/components/Filters/filterTab';
import { useRouter } from 'next/navigation';
import { HighlightText } from '@/components/highlightText';
import { FilterTab_Depart } from '../Filters/filterTab_Depart';

type Ticket = {
  ticketId: string;
  ticketSerialNumber: string;
  status: string;
  title: string;
  userNickname: string;
  managerNickname: string;
  requestedDate: string;
  updatedDate: string;
  firstCategory: string;
  secondCategory: string;
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
      <FilterTab_Depart activeTab={activeTab} handleTabClick={handleTabClick} />
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-6 text-left border-b border-gray-4">
            <th className="px-2 py-2 w-32 text-center">티켓 번호</th>
            <th className="px-2 py-2 w-32 text-center">상태</th>
            <th className="px-2 py-2 w-32 text-center">카테고리</th>
            <th className="px-2 py-2 ml-4 w-50 max-w-50">제목</th> 
            <th className="px-2 py-2 w-28 text-center">담당자</th>
            <th className="px-2 py-2 w-28 text-center">요청자</th>
            <th className="px-2 py-2 w-32 text-center">최근 변경 일시</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.ticketId}
              className="border-t border-gray-5 cursor-pointer h-[50px] hover:bg-gray-100"
              onClick={() => handleTicketClick(ticket.ticketId)}
            >
              <td className="px-4 py-2 text-center truncate">
                <HighlightText text={ticket.ticketSerialNumber} highlight={searchTerm} />
              </td>
              <td className="px-4 py-2 text-center truncate">
                <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusStyles[ticket.status]}`}>
                  {ticket.status}
                </span>
              </td>
              <td className="px-4 py-2 text-center truncate">
                {ticket.firstCategory}/{ticket.secondCategory}
              </td>
              <td className="px-4 py-2 max-w-50 truncate">
                <HighlightText text={ticket.title} highlight={searchTerm} />
              </td>
              <td className="px-4 py-2 text-center truncate">{ticket.managerNickname}</td>
              <td className="px-4 py-2 text-center truncate">{ticket.userNickname}</td>
              <td className="px-4 py-2 text-center truncate">{ticket.updatedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
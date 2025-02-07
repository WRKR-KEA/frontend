import React, { useState, useEffect } from 'react';
import { FilterTab } from '@/components/Filters/filterTab';
import { useRouter } from 'next/navigation';
import { HighlightText } from '@/components/highlightText';
import PagePagination from '@/components/pagination';

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
}: TicketList_DepartProps) {
  const statusStyles: Record<string, string> = {
    REQUEST: 'bg-[#FFE9B6] text-[#D79804]',
    IN_PROGRESS: 'bg-[#CFE3FF] text-[#3E7DD6]',
    COMPLETE: 'bg-[#D1EEE2] text-[#3A966F]',
    CANCEL: 'bg-[#E0E0E0] text-[#767676]',
    REJECT: 'bg-[#F3CDBE] text-[#DE6231]',
  };

  const statusMap: Record<string, string> = {
    COMPLETE: "COMPLETE",
    IN_PROGRESS: "IN_PROGRESS",
    CANCEL: "CANCEL",
    REJECT: "REJECT",
    REQUEST: "REQUEST",
  };
  
  const [currentPage, setCurrentPage] = useState(page);
  const [activeTab, setActiveTab] = useState('전체');
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
    onStatusChange(statusMap[tab]);
  };

  const handleTicketClick = (ticketId: string) => {
    router.push(`/tickets/${ticketId}`);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearchTerm =
      ticket.title.includes(searchTerm) ||
      ticket.ticketSerialNumber.includes(searchTerm) ||
      ticket.userNickname.includes(searchTerm) ||
      ticket.managerNickname.includes(searchTerm);
  
    const matchesDateRange =
      !dateRange.startDate ||
      !dateRange.endDate ||
      (new Date(ticket.requestedDate) >= dateRange.startDate &&
        new Date(ticket.requestedDate) <= dateRange.endDate);
  
    const matchesStatus = status === "" || ticket.status === status; // Filter by status
  
    return matchesSearchTerm && matchesDateRange && matchesStatus; // Apply status filter here
  });

  const displayedTickets = filteredTickets.slice(
    (currentPage - 1) * maxTicketsToShow,
    currentPage * maxTicketsToShow
  );

  return (
    <div className="bg-white rounded-md shadow-md">
      <FilterTab activeTab={activeTab} handleTabClick={handleTabClick} />
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 w-36">티켓 번호</th>
            <th className="px-4 py-2 w-24">상태</th>
            <th className="px-4 py-2 w-80">제목</th>
            <th className="px-4 py-2 w-32">요청자</th>
            <th className="px-4 py-2 w-32">담당자</th>
            <th className="px-4 py-2 w-36">요청일</th>
            <th className="px-4 py-2 w-36">마지막 업데이트</th>
          </tr>
        </thead>
        <tbody>
          {displayedTickets.map((ticket) => (
            <tr
              key={ticket.ticketId}
              className="border-t cursor-pointer"
              onClick={() => handleTicketClick(ticket.ticketId)}
            >
              <td className="px-4 py-2">
                <HighlightText text={ticket.ticketSerialNumber} highlight={searchTerm} />
              </td>
              <td className="px-4 py-2">
                <span className={`rounded-md px-2 py-1 text-sm ${statusStyles[ticket.status]}`}>
                  {ticket.status}
                </span>
              </td>
              <td className="px-4 py-2">
                <HighlightText text={ticket.title} highlight={searchTerm} />
              </td>
              <td className="px-4 py-2">{ticket.userNickname}</td>
              <td className="px-4 py-2">{ticket.managerNickname}</td>
              <td className="px-4 py-2">{ticket.requestedDate}</td>
              <td className="px-4 py-2">{ticket.updatedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div className="flex justify-center items-center mt-4 mb-4">
      <PagePagination
          totalItemsCount={filteredTickets.length}
          itemsCountPerPage={maxTicketsToShow}
          pageRangeDisplayed={5}
          currentPage={currentPage} // 현재 페이지를 전달
          onPageChange={handlePageChange}
        />
      </div> */}
    </div>
  );
}
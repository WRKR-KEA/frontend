import React, { useState, useEffect } from 'react';
import { FilterTab } from '@/components/Filters/filterTab';
import { useRouter } from 'next/navigation'; 
import { ticketDummyData } from "@/data/ticketDummyData";
import { HighlightText } from '@/components/highlightText'; 
import PagePagination from "@/components/pagination";

type TicketList_DepartProps = {
  maxTicketsToShow: number;
  page: number;
  searchTerm: string;
  dateRange: { startDate: Date | null; endDate: Date | null };
};

export function TicketList_Depart({
  maxTicketsToShow,
  page,
  searchTerm,
  dateRange,
}: TicketList_DepartProps) {
  const [tickets, setTickets] = useState(ticketDummyData); 

  const statusStyles: Record<string, string> = {
    작업완료: 'bg-[#D1EEE2] text-[#3A966F]',
    작업진행: 'bg-[#CFE3FF] text-[#3E7DD6]',
    작업취소: 'bg-[#E0E0E0] text-[#767676]',
    반려: 'bg-[#F3CDBE] text-[#DE6231]',
    작업요청: 'bg-[#FFE9B6] text-[#D79804]',
  };

  const [currentPage, setCurrentPage] = useState(page); // 현재 페이지 상태
  const [filterStatus, setFilterStatus] = useState('전체');
  const [activeTab, setActiveTab] = useState('전체');
  const router = useRouter(); 

  useEffect(() => {
    setCurrentPage(page); // `page` prop이 바뀔 때 상태 업데이트
  }, [page]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // 페이지 변경 시 상태 업데이트
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setFilterStatus(tab);
    setCurrentPage(1); 
  };

  const handleTicketClick = (ticketId: string) => {
    const currentPath = window.location.pathname;
    router.push(`${currentPath}/${ticketId}`);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearchTerm =
      ticket.title.includes(searchTerm) ||
      ticket.handler.includes(searchTerm) ||
      ticket.id.includes(searchTerm);
    const matchesStatus =
      filterStatus === '전체' || ticket.status === filterStatus;
  
    const matchesDateRange =
      ticket.requestDate &&
      (!dateRange.startDate ||
        !dateRange.endDate ||
        (new Date(ticket.requestDate) >= dateRange.startDate &&
          new Date(ticket.requestDate) <= dateRange.endDate));
  
    return matchesSearchTerm && matchesStatus && matchesDateRange;
  });
  
  // Sort the filtered tickets by requestDate in descending order
  const sortedTickets = filteredTickets.sort((a, b) => {
    return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
  });
  
  const displayedTickets = sortedTickets.slice(
    (currentPage - 1) * maxTicketsToShow,
    currentPage * maxTicketsToShow
  );

  return (
    <div className="bg-white rounded-md shadow-md">
      <FilterTab activeTab={activeTab} handleTabClick={handleTabClick} />
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 w-36">티켓 ID</th>
            <th className="px-4 py-2 w-24">상태</th>
            <th className="px-4 py-2 w-80">제목</th>
            <th className="px-4 py-2 w-32">담당자</th>
            <th className="px-4 py-2 w-32">요청자</th>
            <th className="px-4 py-2 w-36">요청일</th>
            <th className="px-4 py-2 w-36">마지막 업데이트</th>
          </tr>
        </thead>
        <tbody>
          {displayedTickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-t cursor-pointer"
              onClick={() => handleTicketClick(ticket.id)}
            >
              <td className="px-4 py-2"><HighlightText text={ticket.number} highlight={searchTerm} /></td>
              <td className="px-4 py-2">
                <span
                  className={`rounded-md px-2 py-1 text-sm ${statusStyles[ticket.status]}`}
                >
                  {ticket.status}
                </span>
              </td>
              <td className="px-4 py-2"><HighlightText text={ticket.title} highlight={searchTerm} /></td>
              <td className="px-4 py-2"><HighlightText text={ticket.handler} highlight={searchTerm} /></td>
              <td className="px-4 py-2">{ticket.requester}</td>
              <td className="px-4 py-2">{ticket.requestDate}</td>
              <td className="px-4 py-2">{ticket.updateDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center mt-4 mb-4">
        <PagePagination
          totalItemsCount={filteredTickets.length}
          itemsCountPerPage={maxTicketsToShow}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
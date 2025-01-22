import React, { useState } from 'react';
import { FilterTab } from './filterTab';
import { useRouter } from 'next/navigation';
import { MdPushPin, MdOutlinePushPin } from 'react-icons/md'; // react-icons 추가

type TicketList_UserManagerProps = {
  tickets: Array<{
    id: string;
    number: string;
    status: string;
    title: string;
    requester: string;
    requestDate: string;
    updateDate: string;
    handler: string;
    ispinned: boolean;
  }>;
  maxTicketsToShow: number;
  page: number;
  searchTerm: string;
  dateRange: { startDate: Date | null; endDate: Date | null };
};

export function TicketList_UserManager({
  tickets,
  maxTicketsToShow,
  page,
  searchTerm,
  dateRange,
}: TicketList_UserManagerProps) {
  const statusStyles: Record<string, string> = {
    작업완료: 'bg-[#D1EEE2] text-[#3A966F]',
    작업진행: 'bg-[#CFE3FF] text-[#3E7DD6]',
    작업취소: 'bg-[#E0E0E0] text-[#767676]',
    반려: 'bg-[#F3CDBE] text-[#DE6231]',
    작업요청: 'bg-[#FFE9B6] text-[#D79804]',
  };

  const [filterStatus, setFilterStatus] = useState<string>('전체');
  const [activeTab, setActiveTab] = useState<string>('전체');
  const [pinnedTickets, setPinnedTickets] = useState<string[]>([]);
  const router = useRouter();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setFilterStatus(tab);
  };

  const handleTicketClick = (ticketId: string) => {
    const currentPath = window.location.pathname;
    // console.log(ticketId);
    router.push(`${currentPath}/${ticketId}`);
  };
  
  const handlePinClick = (ticketId: string) => {
    setPinnedTickets((prevPinned) => {
      if (prevPinned.includes(ticketId)) {
        return prevPinned.filter((Id) => Id !== ticketId);
      }
      if (prevPinned.length < 10) {
        return [ticketId, ...prevPinned];
      }
      return prevPinned;
    });
  };

  const sortedTickets = [...tickets].sort((a, b) =>
    new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
  );

  const filteredTickets = sortedTickets.filter((ticket) => {
    const matchesSearchTerm =
      ticket.title.includes(searchTerm) ||
      ticket.handler.includes(searchTerm) ||
      ticket.number.includes(searchTerm);
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

  const displayedTickets = [
    ...filteredTickets.filter((ticket) => pinnedTickets.includes(ticket.number)),
    ...filteredTickets.filter((ticket) => !pinnedTickets.includes(ticket.number)),
  ].slice((page - 1) * maxTicketsToShow, page * maxTicketsToShow);

  return (
    <div className="bg-white rounded-md shadow-md">
      <FilterTab activeTab={activeTab} handleTabClick={handleTabClick} />
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 w-8"></th>
            <th className="px-4 py-2 w-36">티켓 번호</th>
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
              <td
                className="px-4 py-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePinClick(ticket.number); // Pin/unpin using ticket number
                }}
              >
                {pinnedTickets.includes(ticket.number) ? (
                  <MdPushPin className="text-red-500" size={20} />
                ) : (
                  <MdOutlinePushPin className="text-gray-400" size={20} />
                )}
              </td>
              <td className="px-4 py-2">{ticket.number}</td>
              <td className="px-4 py-2">
                <span
                  className={`rounded-md px-2 py-1 text-sm ${statusStyles[ticket.status]}`}
                >
                  {ticket.status}
                </span>
              </td>
              <td className="px-4 py-2">{ticket.title}</td>
              <td className="px-4 py-2">{ticket.handler}</td>
              <td className="px-4 py-2">{ticket.requester}</td>
              <td className="px-4 py-2">{ticket.requestDate}</td>
              <td className="px-4 py-2">{ticket.updateDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import React, { useState } from 'react';
import { FilterTab_Manager } from '@/components/Filters/filterTab_Manager';
import { useRouter } from 'next/navigation';
import { MdPushPin, MdOutlinePushPin } from 'react-icons/md';
import { HighlightText } from '@/components/highlightText';

type TicketList_ManagerProps = {
  tickets: Array<{
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
  }>;
  maxTicketsToShow: number;
  page: number;
  searchTerm: string;
  dateRange: { startDate: Date | null; endDate: Date | null };
  sortOrder: string; 
};

export function TicketList_Manager({
  tickets,
  maxTicketsToShow,
  page,
  searchTerm,
  dateRange,
  sortOrder,  
}: TicketList_ManagerProps) {
  const statusStyles: Record<string, string> = {
    작업완료: 'bg-[#D1EEE2] text-[#3A966F]',
    작업진행: 'bg-[#CFE3FF] text-[#3E7DD6]',
    작업취소: 'bg-[#E0E0E0] text-[#767676]',
    반려: 'bg-[#F3CDBE] text-[#DE6231]',
    // 작업요청: 'bg-[#FFE9B6] text-[#D79804]',
  };

  const [filterStatus, setFilterStatus] = useState('전체');
  const [activeTab, setActiveTab] = useState('전체');
  const [pinnedTickets, setPinnedTickets] = useState<string[]>([]);
  const router = useRouter();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setFilterStatus(tab);
  };

  const handleTicketClick = (ticketId: string) => {
    const currentPath = window.location.pathname;
    router.push(`${currentPath}/${ticketId}`);
  };

  const handlePinClick = (ticketId: string) => {
    setPinnedTickets((prevPinned) => {
      if (prevPinned.includes(ticketId)) {
        // 이미 핀된 티켓을 클릭하면 취소
        return prevPinned.filter((id) => id !== ticketId);
      } else if (prevPinned.length < 10) {
        // 최대 10개까지 핀을 설정
        return [ticketId, ...prevPinned];
      }
      return prevPinned;
    });
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    // console.log(sortOrder);
    if (sortOrder === "최신순") {
      // 최신순: 요청일 순으로 정렬
      return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
    } else if (sortOrder === "오래된 순") {
      // 오래된 순: 요청일 순으로 정렬
      return new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime();
    } else if (sortOrder === "우선순위 순") {
      // 우선순위 순: 핀된 항목 우선
      if (a.ispinned && !b.ispinned) return -1;
      if (!a.ispinned && b.ispinned) return 1;
      return 0; // 둘 다 핀되어 있거나 둘 다 핀이 없으면 원래 순서대로
    }
    return 0; // 기본 값은 변경하지 않음
  });
  
  const filteredTickets = sortedTickets.filter((ticket) => {
    const matchesSearchTerm =
      ticket.title.includes(searchTerm) ||
      ticket.number.includes(searchTerm);
    const matchesStatus =
      (filterStatus === '전체' || ticket.status === filterStatus) && ticket.status !== '작업요청'; 
    return matchesSearchTerm && matchesStatus;
  });
  
  const displayedTickets = [
    ...filteredTickets.filter((ticket) =>
      pinnedTickets.includes(ticket.number) || ticket.ispinned
    ),
    ...filteredTickets.filter((ticket) => !pinnedTickets.includes(ticket.number) && !ticket.ispinned),
  ].slice((page - 1) * maxTicketsToShow, page * maxTicketsToShow);

  return (
    <div className="bg-white rounded-md shadow-md">
      <FilterTab_Manager activeTab={activeTab} handleTabClick={handleTabClick} />
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
          {filteredTickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-t cursor-pointer"
              onClick={() => handleTicketClick(ticket.id)}
            >
              <td
                className="px-4 py-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePinClick(ticket.number); // 티켓 번호로 핀 설정
                }}
              >
                {ticket.ispinned || pinnedTickets.includes(ticket.number) ? (
                  <MdPushPin className="text-red-500" size={20} />
                ) : (
                  <MdOutlinePushPin className="text-gray-400" size={20} />
                )}
              </td>
              <td className="px-4 py-2"><HighlightText text={ticket.number} highlight={searchTerm} /></td>
              <td className="px-4 py-2">
                <span
                  className={`rounded-md px-2 py-1 text-sm ${statusStyles[ticket.status]}`}
                >
                  {ticket.status}
                </span>
              </td>
              <td className="px-4 py-2">
                <HighlightText text={ticket.title} highlight={searchTerm} />
              </td>
              <td className="px-4 py-2">
                {ticket.handler}
              </td>
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
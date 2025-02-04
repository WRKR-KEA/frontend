import React, { useState } from "react";
import { FilterTab } from "@/components/Filters/filterTab";
import { useRouter } from "next/navigation";
import { MdPushPin, MdOutlinePushPin } from "react-icons/md";
import { HighlightText } from "@/components/highlightText";
import PagePagination from "@/components/pagination";

type TicketList_UserProps = {
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
  searchTerm: string;
  dateRange: { startDate: Date | null; endDate: Date | null };
};

export function TicketList_User({
  tickets,
  maxTicketsToShow,
  searchTerm,
  dateRange,
}: TicketList_UserProps) {
  const statusStyles: Record<string, string> = {
    작업완료: "bg-[#D1EEE2] text-[#3A966F]",
    작업진행: "bg-[#CFE3FF] text-[#3E7DD6]",
    작업취소: "bg-[#E0E0E0] text-[#767676]",
    반려: "bg-[#F3CDBE] text-[#DE6231]",
    작업요청: "bg-[#FFE9B6] text-[#D79804]",
  };

  const [filterStatus, setFilterStatus] = useState("전체");
  const [activeTab, setActiveTab] = useState("전체");
  const [pinnedTickets, setPinnedTickets] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 페이지 상태 추가
  const router = useRouter();

  console.log("유저티켓리스트!",tickets)

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setFilterStatus(tab);
    setCurrentPage(1); 
  };

  const handleTicketClick = (ticketId: string) => {
    const currentPath = window.location.pathname;
    router.push(`${currentPath}/${ticketId}`);
  };

  const handlePinClick = (ticketId: string) => {
    setPinnedTickets((prevPinned) => {
      if (prevPinned.includes(ticketId)) {
        return prevPinned.filter((id) => id !== ticketId);
      } else if (prevPinned.length < 10) {
        return [ticketId, ...prevPinned];
      }
      return prevPinned;
    });
  };

  const sortedTickets = [...tickets].sort(
    (a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
  );

  const filteredTickets = sortedTickets.filter((ticket) => {
    const matchesSearchTerm =
      ticket.title.includes(searchTerm) ||
      ticket.handler.includes(searchTerm) ||
      ticket.number.includes(searchTerm);
    const matchesStatus = filterStatus === "전체" || ticket.status === filterStatus;
    const matchesDateRange =
      ticket.requestDate &&
      (!dateRange.startDate ||
        !dateRange.endDate ||
        (new Date(ticket.requestDate) >= dateRange.startDate &&
          new Date(ticket.requestDate) <= dateRange.endDate));
    return matchesSearchTerm && matchesStatus && matchesDateRange;
  });

  const displayedTickets = [
    ...filteredTickets.filter((ticket) => pinnedTickets.includes(ticket.id) || ticket.ispinned),
    ...filteredTickets.filter(
      (ticket) => !pinnedTickets.includes(ticket.id) && !ticket.ispinned
    ),
  ].slice((currentPage - 1) * maxTicketsToShow, currentPage * maxTicketsToShow);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

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
                  handlePinClick(ticket.number);
                }}
              >
                {ticket.ispinned || pinnedTickets.includes(ticket.number) ? (
                  <MdPushPin className="text-red-500" size={20} />
                ) : (
                  <MdOutlinePushPin className="text-gray-400" size={20} />
                )}
              </td>
              <td className="px-4 py-2">
                <HighlightText text={ticket.number} highlight={searchTerm} />
              </td>
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
                <HighlightText text={ticket.handler} highlight={searchTerm} />
              </td>
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
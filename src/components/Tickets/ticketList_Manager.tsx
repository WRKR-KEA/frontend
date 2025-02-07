import React, { useState } from "react";
import { FilterTab_Manager } from "@/components/Filters/filterTab_Manager";
import { useRouter } from "next/navigation";
import { MdPushPin, MdOutlinePushPin } from "react-icons/md";
import { HighlightText } from "@/components/highlightText";
import PagePagination from "@/components/pagination";

type TicketList_ManagerProps = {
  tickets: Array<{
    id: string;
    number: string;
    status: string;
    title: string;
    requester: string;
    requestDate: string;
    updateDate: string | null;
    handler: string;
    ispinned: boolean;
  }>;
  currentPage: number;
  maxTicketsToShow: number;
  searchTerm: string;
  sortOrder: string;
  totalPages: number;
  onStatusChange: (status: string) => void;
};

export function TicketList_Manager({
  tickets,
  maxTicketsToShow,
  searchTerm,
  sortOrder,
  totalPages,    
  onStatusChange,
}: TicketList_ManagerProps) {
  const statusStyles: Record<string, string> = {
    COMPLETE: "bg-[#D1EEE2] text-[#3A966F]",
    IN_PROGRESS: "bg-[#CFE3FF] text-[#3E7DD6]",
    CANCEL: "bg-[#E0E0E0] text-[#767676]",
    REJECT: "bg-[#F3CDBE] text-[#DE6231]",
    REQUEST: "bg-[#FFE9B6] text-[#D79804]",
  };

  const statusMap: Record<string, string> = {
    COMPLETE: "COMPLETE",
    IN_PROGRESS: "IN_PROGRESS",
    CANCEL: "CANCEL",
    REJECT: "REJECT",
    REQUEST: "REQUEST",
  };

  const [activeTab, setActiveTab] = useState("전체");
  const [pinnedTickets, setPinnedTickets] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    onStatusChange(tab === "전체" ? "" : statusMap[tab]);
  };


  const handleTicketClick = (ticketId: string) => {
    router.push(`/tickets/${ticketId}`);
  };

  const handlePinClick = (ticketId: string) => {
    setPinnedTickets((prevPinned) =>
      prevPinned.includes(ticketId)
        ? prevPinned.filter((id) => id !== ticketId)
        : [ticketId, ...prevPinned].slice(0, 10)
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    if (sortOrder === "NEWEST") {
      return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
    }
    if (sortOrder === "OLDEST") {
      return new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime();
    }
    if (sortOrder === "") {
      return (b.ispinned ? 1 : 0) - (a.ispinned ? 1 : 0);
    }
    return 0;
  });

  const displayedTickets = sortedTickets.slice(
    (currentPage - 1) * maxTicketsToShow,
    currentPage * maxTicketsToShow
  );

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
                  handlePinClick(ticket.id);
                }}
              >
                {ticket.ispinned || pinnedTickets.includes(ticket.id) ? (
                  <MdPushPin className="text-red-500" size={20} />
                ) : (
                  <MdOutlinePushPin className="text-gray-400" size={20} />
                )}
              </td>
              <td className="px-4 py-2">
                <HighlightText text={ticket.number} highlight={searchTerm} />
              </td>
              <td className="px-4 py-2">
                <span className={`rounded-md px-2 py-1 text-sm ${statusStyles[ticket.status]}`}>
                  {ticket.status}
                </span>
              </td>
              <td className="px-4 py-2">
                <HighlightText text={ticket.title} highlight={searchTerm} />
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
        totalItemsCount={totalPages * maxTicketsToShow} 
        itemsCountPerPage={maxTicketsToShow}
        pageRangeDisplayed={5}
        currentPage={currentPage}
        totalPages={totalPages} 
        onPageChange={handlePageChange}
      />
      </div>
    </div>
  );
}
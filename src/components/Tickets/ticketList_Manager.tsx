import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MdPushPin, MdOutlinePushPin } from "react-icons/md";
import { HighlightText } from "@/components/highlightText";
import { FilterTab_Manager } from "../Filters/filterTab_Manager";
import api from "@/lib/api/axios";

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
  onPageChange: (page: number) => void;
  status: string;
};

export function TicketList_Manager({
  tickets,
  maxTicketsToShow,
  searchTerm,
  sortOrder,
  totalPages,
  onStatusChange,
  onPageChange,
  status,
}: TicketList_ManagerProps) {
  const statusStyles: Record<string, string> = {
    COMPLETE: "bg-complete text-complete",
    IN_PROGRESS: "bg-inProgress text-inProgress",
    CANCEL: "bg-cancel text-cancel",
    REJECT: "bg-reject text-reject",
    REQUEST: "bg-request text-request",
  };

  const statusMap: Record<string, string> = {
    REQUEST: "작업 요청",
    CANCEL: "취소",
    IN_PROGRESS : "작업 진행",
    REJECT: "반려",
    COMPLETE: "작업 완료",
  };

  const [pinnedTickets, setPinnedTickets] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(status);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    onStatusChange(tab);
  };

  const handleTicketClick = (ticketId: string) => {
    const currentPath = window.location.pathname;
    router.push(`${currentPath}/${ticketId}`);
  };

  const handlePinClick = async (ticketId: string, currentPinStatus: boolean) => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
  
      if (!currentPinStatus && pinnedTickets.length >= 10) {
        setErrorMessage("핀 고정은 최대 10개까지 가능합니다.");
        setTimeout(() => setErrorMessage(null), 3000);
        return; 
      }
  
      const response = await api.patch(
        "/api/manager/tickets/pin",
        {
          ticketId: ticketId,
          pinStatus: !currentPinStatus, 
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      setPinnedTickets((prevState) => {
        if (!currentPinStatus) {
          return [...prevState, ticketId];
        } else {
          return prevState.filter(id => id !== ticketId);
        }
      });
    } catch (err) {
      console.error("Error while pinning/unpinning the ticket:", err);
        setErrorMessage("핀 고정은 최대 10개까지 가능합니다.");
        setTimeout(() => setErrorMessage(null), 3000); // Hide the message after 3 seconds

    }
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    if (sortOrder === "NEWEST") {
      return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
    }
    if (sortOrder === "OLDEST") {
      return new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime();
    }
    if (sortOrder === "UPDATED") {
      return (b.ispinned ? 1 : 0) - (a.ispinned ? 1 : 0);
    }
    return 0;
  });


  return (
    <div className="bg-white rounded-md shadow-md relative">
      {errorMessage && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-[#DF4B38] text-white p-4 rounded-md text-center w-1/2 z-50 animate-fade-out">
          {errorMessage}
        </div>
      )}
      <FilterTab_Manager activeTab={activeTab} handleTabClick={handleTabClick} />
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-6 text-left border-b border-gray-4">
            <th className="px-4 py-2 w-8 min-w-8"></th>
            <th className="px-4 py-2 w-20 min-w-20">티켓 번호</th>
            <th className="px-4 py-2 w-24 min-w-24 text-center">상태</th>
            <th className="px-4 py-2 w-80">제목</th>
            <th className="px-4 py-2 w-32 min-w-32">요청자</th>
            <th className="px-4 py-2 w-44 min-w-44">요청일시</th>
            <th className="px-4 py-2 w-44 min-w-44">최근 변경일시</th>
          </tr>
        </thead>
        <tbody>
          {sortedTickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-t border-gray-5 cursor-pointer"
              onClick={() => handleTicketClick(ticket.id)}
            >
              <td
                className="px-4 py-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePinClick(ticket.id, ticket.ispinned);
                }}
              >
                {ticket.ispinned || pinnedTickets.includes(ticket.id) ? (
                  <MdPushPin className="text-accent-1" size={20} />
                ) : (
                  <MdOutlinePushPin className="text-gray-4" size={20} />
                )}
              </td>
              <td className="px-4 py-2">
                <HighlightText text={ticket.number} highlight={searchTerm} />
              </td>
              <td className="px-4 py-2 text-center">
                <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusStyles[ticket.status]}`}>
                  {statusMap[ticket.status]}
                </span>
              </td>
              <td className="px-4 py-2 truncate">
                <HighlightText text={ticket.title} highlight={searchTerm} />
              </td>
              <td className="px-4 py-2 truncate">{ticket.requester}</td>
              <td className="px-4 py-2">{ticket.requestDate}</td>
              <td className="px-4 py-2">{ticket.updateDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
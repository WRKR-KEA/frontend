import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdPushPin, MdOutlinePushPin } from "react-icons/md";
import { HighlightText } from "@/components/highlightText";
import { FilterTab_Manager } from "../Filters/filterTab_Manager";
import api from "@/lib/api/axios";
import AlertModal from "@/components/Modals/AlertModal";
import Modal from "@/components/Modals/Modal";

type Ticket = {
  createdAt: string;
  firstCategory: string;
  id: string;
  isPinned: boolean;
  requesterNickname: string;
  secondCategory: string;
  serialNumber: string;
  status: string;
  title: string;
  updatedAt: string;
};

type TicketList_ManagerProps = {
  tickets: Ticket[];
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

  const [localTickets, setLocalTickets] = useState<Ticket[]>(tickets);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(status);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText: "닫기",
    onClose: () => {},
  });

  useEffect(() => {
    setLocalTickets(tickets);
  }, [tickets]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onStatusChange(tab);
  };

  const handleTicketClick = (ticketId: string) => {
    const currentPath = window.location.pathname;
    router.push(`${currentPath}/${ticketId}`);
  };

  const showModal = (title: string, btnText = "닫기") => {
    setModalState({
      isOpen: true,
      title,
      btnText,
      onClose: () => setModalState((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const handlePinClick = async (ticketId: string, currentPinStatus: boolean) => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");

      await api.patch(
        "/api/manager/tickets/pin",
        {
          ticketId,
          pinStatus: !currentPinStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setLocalTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, isPinned: !currentPinStatus } : ticket
        )
      );
    } catch (err) {
      console.error("Error while pinning/unpinning the ticket:", err);
      showModal("핀 고정은 최대 10개까지 가능합니다.");
    }
  };

  const sortedTickets = [...localTickets].sort((a, b) => {
    if (sortOrder === "NEWEST") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortOrder === "OLDEST") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortOrder === "UPDATED") {
      return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
    }
    return 0;
  });

  return (
    <div className="bg-white rounded-md relative">
      <FilterTab_Manager activeTab={activeTab} handleTabClick={handleTabClick} />
      {tickets.length === 0 ?(
        <div className="flex flex-col items-center justify-center py-4 text-gray-500">
        <p className="text-md">검색 결과가 없습니다.</p>
      </div>
      ) : (
        <>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-6 text-left border-b border-gray-4">
            <th className="px-4 py-2 w-8 max-w-8"></th>
            <th className="px-4 py-2 w-28 max-w-28 text-center border">티켓 번호</th>
            <th className="px-4 py-2 w-24 max-w-24 text-center">상태</th>
            <th className="px-4 py-2 w-32 max-w-24 text-center">카테고리</th>
            <th className="px-4 py-2 w-80 max-w-80 text-center">제목</th>
            <th className="px-4 py-2 w-32 max-w-32 text-center">요청자</th>
            <th className="px-4 py-2 w-32 max-w-32 text-center">최근 변경 일시</th>
          </tr>
        </thead>
        <tbody>
          {sortedTickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-t border-gray-5 cursor-pointer h-[50px] hover:bg-gray-100"
              onClick={() => handleTicketClick(ticket.id)}
            >
              <td
                className="px-4 py-2 border  max-w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePinClick(ticket.id, ticket.isPinned);
                }}
              >
                {ticket.isPinned ? (
                  <MdPushPin className="text-accent-1" size={20} />
                ) : (
                  <MdOutlinePushPin className="text-gray-4" size={20} />
                )}
              </td>
              <td className="px-4 py-2 max-w-28 border text-center truncate">
                <HighlightText text={ticket.serialNumber} highlight={searchTerm} />
              </td>
              <td className="px-4 py-2 max-w-24 border text-center truncate">
                <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusStyles[ticket.status]}`}>
                  {ticket.status}
                </span>
              </td>
              <td className="px-4 py-2 border max-w-24 text-center truncate">
                {ticket.firstCategory}/{ticket.secondCategory}
              </td>
              <td className="px-4 py-2 border truncate max-w-80 whitespace-nowrap">
                <HighlightText text={ticket.title} highlight={searchTerm} />
              </td>
              <td className="px-4 py-2 max-w-32 border text-center truncate text-center">{ticket.requesterNickname}</td>
              <td className="px-4 py-2 max-w-32 border text-center truncate text-center">{ticket.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalState.isOpen && (
        <Modal onClose={modalState.onClose}>
          <AlertModal title={modalState.title} onClick={modalState.onClose} btnText={modalState.btnText} />
        </Modal>
      )}
      </>
      )}
    </div>
  );
}
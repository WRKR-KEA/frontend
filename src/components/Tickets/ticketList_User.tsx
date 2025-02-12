import React, { useState } from "react";
import { FilterTab } from "@/components/Filters/filterTab";
import { useRouter } from "next/navigation";
import { HighlightText } from "@/components/highlightText";
import PagePagination from "@/components/pagination";

type Ticket = {
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
};

type TicketList_UserProps = {
  tickets: Ticket[];
  maxTicketsToShow: number;
  searchTerm: string;
  onStatusChange: (status: string) => void;
  status: string;
};

export function TicketList_User({
  tickets,
  maxTicketsToShow,
  searchTerm,
  onStatusChange,
  status,
}: TicketList_UserProps) {

  const statusStyles: Record<string, string> = {
    COMPLETE: "bg-complete text-complete",
    IN_PROGRESS: "bg-inProgress text-inProgress",
    CANCEL: "bg-cancel text-cancel",
    REJECT: "bg-reject text-reject",
    REQUEST: "bg-request text-request",
  };

  const [filterStatus, setFilterStatus] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setFilterStatus(tab);
    setCurrentPage(1);
    onStatusChange(tab);
  };

  const handleTicketClick = (Id: string) => {
    const currentPath = window.location.pathname;
    router.push(`${currentPath}/${Id}`);
  };

  const sortedTickets = [...tickets].sort(
    (a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
  );

  const filteredTickets = sortedTickets.filter((ticket) => {
    const matchesSearchTerm =
      ticket.title.includes(searchTerm) ||
      ticket.handler?.includes(searchTerm) ||
      ticket.number.includes(searchTerm);
    const matchesStatus =
      filterStatus === "" || ticket.status === filterStatus;
    return matchesSearchTerm && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTickets.length / maxTicketsToShow);
  const displayedTickets = filteredTickets.slice(
    (currentPage - 1) * maxTicketsToShow,
    currentPage * maxTicketsToShow
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-white rounded-md">
      <FilterTab activeTab={activeTab} handleTabClick={handleTabClick} />
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-6 text-left border-b border-gray-4">
            <th className="px-4 py-2 w-20 min-w-20 text-center">티켓 번호</th>
            <th className="px-4 py-2 w-24 min-w-24 text-center">상태</th>
            <th className="px-4 py-2 w-80">제목</th>
            <th className="px-4 py-2 w-32 min-w-32 text-center">담당자</th>
            <th className="px-4 py-2 w-44 min-w-44 text-center">요청일</th>
            <th className="px-4 py-2 w-44 min-w-44 text-center">최근 변경일</th>
          </tr>
        </thead>
        <tbody>
          {displayedTickets.map((ticket) => {
            return (
              <tr
                key={ticket.id}
                className="border-t border-gray-5 cursor-pointer"
                onClick={() => handleTicketClick(ticket.id)}
              >
                <td className="px-4 py-2 text-center">
                  <HighlightText text={ticket.number} highlight={searchTerm} />
                </td>
                <td className="px-4 py-2 text-center">
                  <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusStyles[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-4 py-2 truncate">
                  <HighlightText text={ticket.title} highlight={searchTerm} />
                </td>
                <td className="px-4 py-2 truncate text-center">
                  <HighlightText text={ticket.handler || "-"} highlight={searchTerm} />
                </td>
                <td className="px-4 py-2 text-center">{ticket.requestDate}</td>
                <td className="px-4 py-2 text-center">{ticket.updateDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
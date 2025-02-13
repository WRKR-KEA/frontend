import React, { useState } from "react";
import { FilterTab } from "@/components/Filters/filterTab";
import { useRouter } from "next/navigation";
import { HighlightText } from "@/components/highlightText";

type Ticket = {
  id: string,
  serialNumber: string,
  firstCategory: string,
  secondCategory: string,
  status: string,
  title: string,
  managerName: string | "-",
  createdAt: string,
  updatedAt: string | "-",
  startedAt: string | "-",
  endedAt: string | "-",
  completedAt: string | "-",
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
  console.log("here",tickets);
  const [activeTab, setActiveTab] = useState(status);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onStatusChange(tab);
  };

  const handleTicketClick = (Id: string) => {
    const currentPath = window.location.pathname;
    router.push(`${currentPath}/${Id}`);
  };

  const sortedTickets = [...tickets].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredTickets = sortedTickets.filter((ticket) => {
    const matchesSearchTerm =
      ticket.title.includes(searchTerm) ||
      ticket.managerName?.includes(searchTerm) ||
      ticket.serialNumber.includes(searchTerm);
    const matchesStatus =
      status === "" || ticket.status === status;
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
      {tickets.length === 0 ?(
        <div className="flex flex-col items-center justify-center py-4 text-gray-500">
        <p className="text-md">검색 결과가 없습니다.</p>
      </div>
      ) : (
        <>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-t border-gray-5 cursor-pointer h-[50px] hover:bg-gray-100">
            <th className="px-4 py-2 w-20 min-w-20 text-center">티켓 번호</th>
            <th className="px-4 py-2 w-24 min-w-24 text-center">상태</th>
            <th className="px-4 py-2 w-32 min-w-24 text-center">카테고리</th>
            <th className="px-4 py-2 w-60">제목</th>
            <th className="px-4 py-2 w-32 min-w-32 text-center">담당자</th>
            <th className="px-4 py-2 w-44 min-w-44 text-center">최근 변경 일자</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((ticket) => {
            return (
              <tr
                key={ticket.id}
                className="border-t border-gray-5 cursor-pointer h-[50px] hover:bg-gray-100"
                onClick={() => handleTicketClick(ticket.id)}
              >
                <td className="px-4 py-2 text-center">
                  <HighlightText text={ticket.serialNumber} highlight={searchTerm} />
                </td>
                <td className="px-4 py-2 text-center">
                  <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusStyles[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  {ticket.firstCategory}/{ticket.secondCategory}
                </td>
                <td className="px-4 py-2 truncate">
                  <HighlightText text={ticket.title} highlight={searchTerm} />
                </td>
                <td className="px-4 py-2 truncate text-center">
                  <HighlightText text={ticket.managerName || "-"} highlight={searchTerm} />
                </td>
                <td className="px-4 py-2 text-center">{ticket.updatedAt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </>
      )}
    </div>
  );
}
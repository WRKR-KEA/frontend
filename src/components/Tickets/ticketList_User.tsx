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
};

export function TicketList_User({
  tickets,
  maxTicketsToShow,
  searchTerm,
}: TicketList_UserProps) {
  console.log("받은 티켓 데이터:", tickets);

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
    REQEUST: "REQUEST",
  };

  const [filterStatus, setFilterStatus] = useState("전체");
  const [activeTab, setActiveTab] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setFilterStatus(tab);
    setCurrentPage(1);
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
      ticket.handler.includes(searchTerm) ||
      ticket.number.includes(searchTerm);
    const matchesStatus =
      filterStatus === "전체" || statusMap[ticket.status] === filterStatus;
    return matchesSearchTerm && matchesStatus;
  });

  const displayedTickets = filteredTickets.slice(
    (currentPage - 1) * maxTicketsToShow,
    currentPage * maxTicketsToShow
  );

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
          {displayedTickets.map((ticket) => {
            const localizedStatus = statusMap[ticket.status] || ticket.status;
            return (
              <tr
                key={ticket.id}
                className="border-t cursor-pointer"
                onClick={() => handleTicketClick(ticket.id)}
              >
                <td className="px-4 py-2">
                  <HighlightText text={ticket.number} highlight={searchTerm} />
                </td>
                <td className="px-4 py-2">
                  <span className={`rounded-md px-2 py-1 text-sm ${statusStyles[localizedStatus]}`}>
                    {localizedStatus}
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
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-center items-center mt-4 mb-4">
        <PagePagination
          totalItemsCount={filteredTickets.length}
          itemsCountPerPage={maxTicketsToShow}
          pageRangeDisplayed={5}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
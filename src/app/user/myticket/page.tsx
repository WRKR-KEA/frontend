"use client";

import React, { useState, useEffect } from "react";
import { TicketList_User } from "@/components/Tickets/ticketList_User";
import { FilterNum } from "@/components/Filters/filterNum";
import { Search } from "@/components/search";
import useUserStore from "@/stores/userStore";
import api from "@/lib/api/axios";
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

export default function UserTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const user = useUserStore((state) => state.user);
  const ticketRequester = user ? user.name : "";

  // Fetch tickets on page load or when page or ticket count changes
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");
        const response = await api.get("/api/user/tickets", {
          params: {
            page: currentPage,
            size: maxTicketsToShow,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const { elements, totalPages } = response.data.result;

        const requestTicketList: Ticket[] = elements.map((ticket: any) => ({
          id: ticket.id,
          number: ticket.serialNumber,
          status: ticket.status,
          title: ticket.title,
          handler: ticket.managerName, 
          requestDate: ticket.createdAt,
          updateDate: ticket.updatedAt,
          acceptDate: ticket.startedAt,
          completeDate: ticket.endAt, 
          ispinned: false, 
        }));

        setTickets(requestTicketList);
        console.log(response);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [currentPage, maxTicketsToShow]); // Run effect when page or maxTicketsToShow changes

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber); // Update the current page
  };

  const handleSelectCount = (count: number) => {
    setMaxTicketsToShow(count); // Update the number of tickets to show per page
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term); // Update the search term
  };

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">티켓 조회</h2>

        <div className="flex items-center space-x-4 ml-4">
          <Search onSearchChange={handleSearchChange} placeHolder="제목, 담당자, 티켓번호" />
        </div>

        <div className="ml-auto">
          <FilterNum onSelectCount={handleSelectCount} selectedCount={maxTicketsToShow} />
        </div>
      </div>

      <TicketList_User tickets={tickets} maxTicketsToShow={maxTicketsToShow} searchTerm={searchTerm} />
      
      <div className="flex justify-center items-center mt-4 mb-4">
        <PagePagination
          totalItemsCount={tickets.length}
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
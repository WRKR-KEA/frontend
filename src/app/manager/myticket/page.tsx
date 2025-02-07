"use client";

import { useState, useEffect, useCallback } from "react";
import { TicketList_Manager } from "@/components/Tickets/ticketList_Manager";
import { FilterNum } from "@/components/Filters/filterNum";
import { FilterOrder } from "@/components/Filters/filterOrder";
import { Search_manager } from "@/components/search_manager";
import api from "@/lib/api/axios";
import PagePagination from "@/components/pagination";

export default function ManagerTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tickets, setTickets] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleSelectCount = (count: number) => {
    setMaxTicketsToShow(count);
    setCurrentPage(1);  // Reset to page 1 when changing the count
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);  // Reset to page 1 when searching
  };

  const handleSelectOrder = (order: string) => {
    setSortOrder(order);
    setCurrentPage(1);  // Reset to page 1 when changing order
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);  // Update currentPage based on the selected page number
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);  // Reset to page 1 when changing status
  };

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const response = await api.get(
        `/api/manager/tickets?page=${currentPage}&size=${maxTicketsToShow}&sortType=${sortOrder}&status=${selectedStatus || ""}&query=${searchTerm}`,
        {
          headers: {
            Accept: "application/json;charset=UTF-8",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data;

      if (data.isSuccess) {
        const formattedTickets = data.result.elements.map((ticket: any) => ({
          id: ticket.id,
          number: ticket.serialNumber,
          status: ticket.status,
          title: ticket.title,
          requester: ticket.requesterNickname,
          requestDate: ticket.createdAt,
          updateDate: ticket.updatedAt,
          handler: "",
          ispinned: ticket.isPinned,
        }));

        setTickets(formattedTickets);
        setTotalPages(Math.ceil(data.result.totalElements / maxTicketsToShow));
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError("티켓 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, maxTicketsToShow, sortOrder, selectedStatus, searchTerm]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]); // Re-fetch tickets whenever fetchTickets is updated

  useEffect(() => {
    fetchTickets(); // Ensure data is fetched whenever currentPage changes
  }, [currentPage]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex items-center">
        <h2 className="text-md font-semibold">티켓 조회</h2>

        <div className="flex items-center space-x-2 ml-4">
          <Search_manager onSearchChange={handleSearchChange} />
        </div>

        <div className="ml-auto flex items-center">
          <FilterOrder onSelectOrder={handleSelectOrder} />
          <FilterNum onSelectCount={handleSelectCount} selectedCount={maxTicketsToShow} />
        </div>
      </div>

      <TicketList_Manager
        tickets={tickets}
        maxTicketsToShow={maxTicketsToShow}
        searchTerm={searchTerm}
        sortOrder={sortOrder}
        currentPage={currentPage}
        totalPages={totalPages}
        onStatusChange={handleStatusChange}
        onPageChange={handlePageChange}  
      />
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
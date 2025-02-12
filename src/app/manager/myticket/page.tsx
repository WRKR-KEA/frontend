"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TicketList_Manager } from "@/components/Tickets/ticketList_Manager";
import { FilterNum } from "@/components/Filters/filterNum";
import { FilterOrder } from "@/components/Filters/filterOrder";
import api from "@/lib/api/axios";
import PagePagination from "@/components/pagination";
import { Search_manager } from "@/components/search_manager";
import Skeleton from "@/components/Skeleton"; // Assuming you have a Skeleton component

export default function ManagerTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [sortOrder, setSortOrder] = useState("UPDATED");
  const [currentPage, setCurrentPage] = useState(1);
  const [tickets, setTickets] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectCount = useCallback((count: number) => {
    setMaxTicketsToShow(count);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleSelectOrder = useCallback((order: string) => {
    setSortOrder(order);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
    setStatus(status);
    setCurrentPage(1);
  }, []);

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
        setTickets(
          data.result.elements.map((ticket: any) => ({
            id: ticket.id,
            number: ticket.serialNumber,
            status: ticket.status,
            title: ticket.title,
            requester: ticket.requesterNickname,
            requestDate: ticket.createdAt,
            updateDate: ticket.updatedAt,
            handler: "",
            ispinned: ticket.isPinned,
          }))
        );
        console.log("✨ 담당 티켓 리스트: ",data.result.elements);
        setTotalPages(response.data.result.totalPages);
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
  }, [fetchTickets]);

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">티켓 조회</h2>
  
        <div className="flex items-center space-x-2 ml-4">
          <Search_manager
            onSearchChange={handleSearchChange}
            searchTerm={searchTerm}
            searchInputRef={searchInputRef}
          />
        </div>
  
        <div className="ml-auto flex items-center">
          <FilterOrder onSelectOrder={handleSelectOrder} sortOrder={sortOrder} />
          <FilterNum onSelectCount={handleSelectCount} selectedCount={maxTicketsToShow} />
        </div>
      </div>
  
      <div className="relative min-h-[200px]">
  {isLoading || tickets.length === 0 ? (
    <div className="flex flex-col items-center space-y-4">
      <Skeleton width="100%" height="600px" />
    </div>
  ) : (
    <>
      <TicketList_Manager
        tickets={tickets}
        maxTicketsToShow={maxTicketsToShow}
        searchTerm={searchTerm}
        sortOrder={sortOrder}
        currentPage={currentPage}
        totalPages={totalPages}
        status={status || ""}
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
    </>
  )}
  </div>
</div>  
  );
}
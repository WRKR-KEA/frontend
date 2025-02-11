"use client"

import { useState, useEffect, useRef } from "react";
import { TicketList_Manager } from "@/components/Tickets/ticketList_Manager";
import { FilterNum } from "@/components/Filters/filterNum";
import { FilterOrder } from "@/components/Filters/filterOrder";
import api from "@/lib/api/axios";
import PagePagination from "@/components/pagination";
import { Search_manager } from "@/components/search_manager";

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

  const searchInputRef = useRef<HTMLInputElement | null>(null); // 검색창에 대한 ref 추가

  const handleSelectCount = (count: number) => {
    setMaxTicketsToShow(count);
    setCurrentPage(1);  // Reset to page 1 when changing the count
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);  // 검색어 상태 업데이트
    setCurrentPage(1);  // Reset to page 1 when search term changes
    console.log("🔍 검색어:", term);
  };

  const handleSelectOrder = (order: string) => {
    setSortOrder(order);
    setCurrentPage(1);  // Reset to page 1 when changing order
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber); 
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setStatus(status);
    setCurrentPage(1);  
  };

  const fetchTickets = async () => {
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
        console.log("🍉 api 정보", response);
        setTickets(formattedTickets);
        console.log("🍉 담당 티켓 정보", formattedTickets);
        setTotalPages(response.data.result.totalPages);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError("티켓 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [currentPage, maxTicketsToShow, sortOrder, selectedStatus, searchTerm]); 

  if (isLoading) return <div></div>;
  if (error) return <div>{error}</div>;

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
  
      {/* isLoading 상태일 때 기존 UI를 유지하고, 티켓 목록만 로딩 표시 */}
      <div className="relative min-h-[200px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
            <span className="text-gray-500">로딩 중...</span>
          </div>
        )}
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
      </div>
  
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
"use client";

import { useState, useEffect } from "react";
import { TicketList_Manager } from "@/components/Tickets/ticketList_Manager";
import { FilterNum } from "@/components/Filters/filterNum";
import { FilterOrder } from "@/components/Filters/filterOrder";
import { Search_manager } from "@/components/search_manager";
import api from "@/lib/api/axios";

export default function ManagerTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("NEWEST");
  const [currentPage, setCurrentPage] = useState(1);
  const [tickets, setTickets] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectCount = (count: number) => {
    setMaxTicketsToShow(count);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSelectOrder = (order: string) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const response = await api.get(
        `/api/manager/tickets?page=${currentPage}&size=${maxTicketsToShow}&sortType=${sortOrder}&status=IN_PROGRESS&query=${searchTerm}`,
        {
          headers: {
            Accept: "application/json;charset=UTF-8",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      console.log("API 응답 데이터:", response); // 전체 응답 로깅
      console.log("응답 데이터 바디:", response.data); // 데이터 바디만 로깅
  
      const data = response.data;
  
      if (data.isSuccess) {
        const formattedTickets = data.result.elements.map((ticket: any) => ({
          id: ticket.id,
          number: ticket.serialNumber,
          status: ticket.status,
          title: ticket.title,
          requester: ticket.requesterName,
          requestDate: ticket.createdAt,
          updateDate: ticket.updatedAt,
          handler: "",
          ispinned: ticket.isPinned,
        }));
  
        console.log("포맷된 티켓 목록:", formattedTickets); // 변환된 티켓 정보 로깅
  
        setTickets(formattedTickets);
        setTotalPages(data.result.totalPages);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("API 요청 오류:", err); // 에러 메시지 출력
      setError("티켓 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [searchTerm, maxTicketsToShow, sortOrder, currentPage]);

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
          <FilterNum onSelectCount={handleSelectCount} />
        </div>
      </div>

      <TicketList_Manager
        tickets={tickets}
        maxTicketsToShow={maxTicketsToShow}
        searchTerm={searchTerm}
        sortOrder={sortOrder}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
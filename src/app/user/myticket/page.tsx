"use client";

import React, { useState, useEffect } from "react";
import { TicketList_User } from "@/components/Tickets/ticketList_User";
import { FilterNum } from "@/components/Filters/filterNum";
import { Search } from "@/components/search";
import useUserStore from "@/stores/userStore";
import api from "@/lib/api/axios";
import PagePagination from "@/components/pagination";
import Skeleton from "@/components/Skeleton"; // 스켈레톤 컴포넌트 가져오기

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
  const [status, setStatus] = useState<string>(""); // 🔹 상태 필터 추가
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태

  const user = useUserStore((state) => state.user);
  const ticketRequester = user ? user.name : "";

  // 🔹 티켓 목록 가져오기
  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true); // 데이터 로딩 시작
      try {
        const accessToken = sessionStorage.getItem("accessToken");
        const response = await api.get(`/api/user/tickets?page=${currentPage}&size=${maxTicketsToShow}&status=${status || ""}`, {
          params: {
            page: currentPage,
            size: maxTicketsToShow,
            ...(status && { status }),
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
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setIsLoading(false); // 데이터 로딩 끝
      }
    };

    fetchTickets();
  }, [currentPage, maxTicketsToShow, status]); // 🔹 상태 필터 변경 시 재요청

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 티켓 개수 선택 핸들러
  const handleSelectCount = (count: number) => {
    setMaxTicketsToShow(count);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  // 🔹 상태 필터 변경 핸들러
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
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

      {isLoading  || tickets.length === 0  ? (
        // 로딩 중이면 스켈레톤 표시
        <div>
          <Skeleton width="100%" height="600px" />
        </div>
      ) : (
        // 로딩이 끝나면 실제 티켓 리스트와 페이지네이션 표시
        <>
          <TicketList_User
            tickets={tickets}
            maxTicketsToShow={maxTicketsToShow}
            searchTerm={searchTerm}
            onStatusChange={handleStatusChange}
            status={status || ""}
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
  );
}
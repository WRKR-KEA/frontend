"use client"

import React, { useState, useEffect, useCallback, useRef } from "react";
import { TicketList_User } from "@/components/Tickets/ticketList_User";
import { FilterNum } from "@/components/Filters/filterNum";
import { Search } from "@/components/search";
import useUserStore from "@/stores/userStore";
import PagePagination from "@/components/pagination";
import Skeleton from "@/components/Skeleton"; 
import { useUserTicketListQuery } from "@/hooks/useUserTicketList";
import SkeletonNet from "@/components/SkeletonNet";
import SkeletonZero from "@/components/SkeletonZero"; 

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

export default function UserTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string>(""); 
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItemsCount, setTotalItems] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null); // 필터의 외부 클릭을 감지할 ref
  const toggleFilter = () => {
    setOpenFilter(openFilter ? null : "num"); 
  }
  const user = useUserStore((state) => state.user);

  // 🔹 티켓 목록 가져오기
  const { data, error } = useUserTicketListQuery(currentPage, maxTicketsToShow, selectedStatus);

  // 데이터가 성공적으로 로드되면 콘솔에 출력
  useEffect(() => {
    if (data) {
      console.log("🌟 가져온 데이터 목록: ", data);
      console.log("🌟 가져온 티켓 목록: ", data.elements);
      // 티켓 목록을 상태에 저장
      setTickets(data.elements);
      setTotalPages(data.totalPages);
      setIsLoading(false); // 데이터 로딩 완료
    }
  }, [data]);

  // 외부 클릭 시 필터 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setOpenFilter(null); // 필터를 닫음
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
  const handleStatusChange = useCallback((newStatus: string) => {
    setSelectedStatus(newStatus);
    setStatus(newStatus);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  }, []);

  if (error) {
    return <SkeletonNet width="100%" height="100%" />;
  }

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">티켓 조회</h2>
        <div className="flex items-center space-x-4 ml-4">
          <Search onSearchChange={handleSearchChange} placeHolder="페이지 내 제목, 담당자, 티켓번호 검색" />
        </div>

        <div className="ml-auto">
          <div ref={filterRef}>
            <FilterNum
              onSelectCount={handleSelectCount}
              selectedCount={maxTicketsToShow}
              isOpen={openFilter === "num"}
              setIsOpen={() => toggleFilter()}
            />
          </div>
        </div>
      </div>

      {isLoading ?(
        <div>
          <Skeleton width="100%" height="600px" />
        </div>
      ) :(
        <>
          <TicketList_User
            tickets={tickets}
            maxTicketsToShow={maxTicketsToShow}
            searchTerm={searchTerm}
            onStatusChange={handleStatusChange}
            status={status || ""}
          />
          {tickets.length === 0 ?(
        <div>
        </div>
      ) : (
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
      )}</>
      )}
    </div>
  );
}
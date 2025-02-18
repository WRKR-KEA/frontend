"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { TicketList_Manager } from "@/components/Tickets/ticketList_Manager";
import { FilterNum } from "@/components/Filters/filterNum";
import { FilterOrder } from "@/components/Filters/filterOrder";
import PagePagination from "@/components/pagination";
import { Search_manager } from "@/components/search_manager";
import Skeleton from "@/components/Skeleton";
import { useManageTicketListQuery } from "@/hooks/useManageTicketList";
import SkeletonNet from "@/components/SkeletonNet";

export default function ManagerTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("UPDATED");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isFilterNumOpen, setIsFilterNumOpen] = useState(false);
  const [isFilterOrderOpen, setIsFilterOrderOpen] = useState(false);

  const [tickets, setTickets] = useState<any[]>([]);

  const { data, isLoading, error, refetch } = useManageTicketListQuery(
    currentPage,
    maxTicketsToShow,
    sortOrder,
    selectedStatus,
    searchTerm
  );

  useEffect(() => {
    if (data) {
      setTickets(data.elements);
      console.log("📌 받은 티켓 데이터:", data.elements);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [selectedStatus, currentPage, maxTicketsToShow, sortOrder, searchTerm, refetch]);

  const handleSelectCount = useCallback((count: number) => {
    setMaxTicketsToShow(count);
    setCurrentPage(1);
    setIsFilterNumOpen(false);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleSelectOrder = useCallback((order: string) => {
    setSortOrder(order);
    setCurrentPage(1);
    setIsFilterOrderOpen(false);
  }, []);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  }, []);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterNumOpen(false);
        setIsFilterOrderOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [openFilter, setOpenFilter] = useState<string | null>(null); 

  const toggleFilter = (filterType: string) => {
    setOpenFilter(openFilter === filterType ? null : filterType);
  };

  if (error) {
    return <SkeletonNet width="100%" height="100%" />;
  }

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">티켓 조회</h2>

        <div className="flex items-center space-x-2 ml-4">
          <Search_manager
            onSearchChange={handleSearchChange}
            placeHolder="제목, 티켓번호 검색"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                console.log("검색 실행:", searchTerm);
              }
            }}
            onBlur={() => console.log("검색어 입력 완료:", searchTerm)}
          />
        </div>

        <div className="ml-auto flex items-center space-x-2" ref={filterRef}>
        <FilterOrder
            onSelectOrder={handleSelectOrder}
            sortOrder={sortOrder}
            isOpen={openFilter === "order"}
            setIsOpen={() => toggleFilter("order")}
          />
          <FilterNum
            onSelectCount={handleSelectCount}
            selectedCount={maxTicketsToShow}
            isOpen={openFilter === "num"}
            setIsOpen={() => toggleFilter("num")}
          />
        </div>
      </div>

      {isLoading ? (
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
            totalPages={data?.totalPages || 1}
            status={selectedStatus || ""}
            onStatusChange={handleStatusChange}
            onPageChange={handlePageChange}
          />
          {data?.elements.length === 0 ? (
            <div></div>
          ) : (
            <div className="flex justify-center items-center mt-4 mb-4">
              <PagePagination
                totalItemsCount={data?.elements.length || 0}
                itemsCountPerPage={maxTicketsToShow}
                pageRangeDisplayed={5}
                currentPage={currentPage}
                totalPages={data?.totalPages || 1}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
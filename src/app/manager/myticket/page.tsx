"use client";

import { useState, useRef, useCallback ,useEffect} from "react";
import { TicketList_Manager } from "@/components/Tickets/ticketList_Manager";
import { FilterNum } from "@/components/Filters/filterNum";
import { FilterOrder } from "@/components/Filters/filterOrder";
import PagePagination from "@/components/pagination";
import { Search_manager } from "@/components/search_manager";
import Skeleton from "@/components/Skeleton";
import { useManageTicketListQuery } from "@/hooks/useManageTicketList";

export default function ManagerTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("UPDATED");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const { data, isLoading, error } = useManageTicketListQuery(
    currentPage,
    maxTicketsToShow,
    sortOrder,
    selectedStatus,
    searchTerm
  );

  useEffect(() => {
    if (data) {
      console.log("📌 받은 티켓 데이터:", data);
    }
  }, [data]);

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
    setCurrentPage(1);
  }, []);

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
  
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <Skeleton width="100%" height="600px" />
          </div>
        ) :(
          <>
            <TicketList_Manager
              tickets={data?.elements || []}
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
              <div>
          </div>
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
            )}</>
            )}
          </div>
        );
      }
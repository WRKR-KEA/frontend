"use client";

import { useState, useEffect } from "react";
import { TicketList_Depart } from "@/components/Tickets/ticketList_Depart";
import { FilterNum } from "@/components/Filters/filterNum";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { fetchManagerDepartmentTicketExcel } from "@/services/manager";
import { useDepartTicketListQuery } from "@/hooks/useDepartTicketList";
import PagePagination from "@/components/pagination";
import Button from "@/components/Buttons/Button";
import Skeleton from "@/components/Skeleton";
import SkeletonNet from "@/components/SkeletonNet";
import SkeletonZero from "@/components/SkeletonZero"; 
import { Search_depart } from "@/components/search_depart";

export default function DepartmentTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string>("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<any>({
    startDate: null,
    endDate: null,
    key: "selection",
  });

  const [openFilter, setOpenFilter] = useState<string | null>(null); 

  const formattedDateRange = dateRange.startDate
    ? `${format(dateRange.startDate, "yyyy.MM.dd")} - ${format(dateRange.endDate, "yyyy.MM.dd")}`
    : "모든 날짜";

  const { data, isLoading, error, isFetching } = useDepartTicketListQuery(
    searchTerm,
    status,
    dateRange,
    currentPage,
    maxTicketsToShow
  );

  const tickets = data?.elements || [];
  const totalPages = data?.totalPages || 1;
  const totalItemsCount = data?.totalElements || 0;

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
    if (openFilter) {
      setOpenFilter(null); // Close filter if open
    }
  };

  const toggleFilter = () => {
    setOpenFilter(openFilter ? null : "num"); // Toggle filter
    if (isCalendarOpen) {
      setIsCalendarOpen(false); // Close calendar if open
    }
  };

  const handleSelectCount = (count: number) => {
    setMaxTicketsToShow(count);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDateChange = (ranges: any) => {
    setDateRange(ranges.selection);
  };

  const handleStatusChange = (status: string) => {
    setStatus(status);
    setCurrentPage(1);
  };

  const handleDownloadExcel = async () => {
    try {
      const data = await fetchManagerDepartmentTicketExcel(
        searchTerm,
        status,
        dateRange.startDate ? format(dateRange.startDate, "yyyy-MM-dd") : undefined,
        dateRange.endDate ? format(dateRange.endDate, "yyyy-MM-dd") : undefined
      );

      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "부서_티켓_조회.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("엑셀 다운로드 중 오류 발생:", error);
    }
  };

  const [searchInput, setSearchInput] = useState(""); // 검색 입력 필드
  const [searchTrigger, setSearchTrigger] = useState(""); // ✅ Enter 입력 후 실행할 검색어

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchTrigger(searchInput); // ✅ 현재 검색어로 실행
      setCurrentPage(1); // 검색 시 첫 페이지로 이동
    }
  };

  const handleSearch = () => {
    setSearchTrigger(searchInput); // ✅ 현재 검색어로 실행
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  if (error) {
    return <SkeletonNet width="100%" height="100%" />;
  }

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">티켓 조회</h2>

        <div className="flex items-center space-x-2 ml-4">
          <Search_depart
            onSearchChange={handleSearchChange}
            placeHolder="제목, 티켓번호, 담당자 검색"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                console.log("검색 실행:", searchTerm);
              }
            }}
            onBlur={() => console.log("검색어 입력 완료:", searchTerm)}
          />
        </div>

        <div className="ml-auto flex items-center relative">
          <button
            className="flex items-center text-sm font-medium text-main-2 hover:text-main-1 px-4 py-2 rounded-md"
            onClick={toggleCalendar}
          >
            <span>{formattedDateRange}</span>
            <img src="/calendarIcon.png" alt="Calendar Icon" className="w-5 h-5 ml-2 mb-1" />
          </button>

          {isCalendarOpen && (
            <div className="absolute top-12 right-0 z-10 bg-white border shadow-lg rounded-md">
              <DateRange
                editableDateInputs={true}
                onChange={handleDateChange}
                moveRangeOnFirstSelection={false}
                ranges={[dateRange]}
                rangeColors={["#6E61CA"]}
              />
            </div>
          )}
          <FilterNum
            onSelectCount={handleSelectCount}
            selectedCount={maxTicketsToShow}
            isOpen={openFilter === "num"}
            setIsOpen={() => toggleFilter()}
          />
        </div>
      </div>

      <div className="relative min-h-[200px]">
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <Skeleton width="100%" height="600px" />
          </div>
        ) : (
          <>
            <TicketList_Depart
              tickets={tickets}
              maxTicketsToShow={maxTicketsToShow}
              page={currentPage}
              searchTerm={searchTerm}
              dateRange={dateRange}
              status={status || ""}
              onStatusChange={handleStatusChange}
            />

            {tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <SkeletonZero width="100%" height="" />
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-4 mt-4">
                  <Button label="다운로드" onClick={handleDownloadExcel} color={1} className="mr-2" />
                </div>

                <div className="flex justify-center items-center mt-4 mb-4">
                  <PagePagination
                    totalItemsCount={totalItemsCount}
                    itemsCountPerPage={maxTicketsToShow}
                    pageRangeDisplayed={5}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
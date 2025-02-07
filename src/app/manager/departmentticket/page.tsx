"use client";

import { useState, useEffect } from "react";
import { TicketList_Depart } from "@/components/Tickets/ticketList_Depart";
import { FilterNum } from "@/components/Filters/filterNum";
import { Search } from "@/components/search";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { fetchManagerDepartmentTicket } from "@/services/manager";

export default function DepartmentTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<any>({
    startDate: null,
    endDate: null,
    key: "selection",
  });
  const [status, setStatus] = useState<string | null>(null);

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleSelectCount = (count: number) => {
    setMaxTicketsToShow(count);
    setCurrentPage(1); // 페이지 초기화
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // 페이지 변경 시 스크롤 맨 위로 이동
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleDateChange = (ranges: any) => {
    setDateRange(ranges.selection);
  };

  const formattedDateRange = dateRange.startDate
    ? `${format(dateRange.startDate, "yyyy.MM.dd")} - ${format(
        dateRange.endDate,
        "yyyy.MM.dd"
      )}`
    : "모든 날짜";

    const handleStatusChange = (newStatus: string | null) => {
      setStatus(newStatus);
    };
    
    const fetchTickets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchManagerDepartmentTicket(
          searchTerm,
          status,
          dateRange.startDate ? format(dateRange.startDate, "yyyy-MM-dd") : null,
          dateRange.endDate ? format(dateRange.endDate, "yyyy-MM-dd") : null,
          currentPage,
          maxTicketsToShow
        );
        setTickets(data?.result?.elements || []);
        console.log("ticket", tickets);
      } catch (err) {
        setError("티켓 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
console.log(tickets);
  useEffect(() => {
    fetchTickets();
  }, [searchTerm, dateRange, currentPage, maxTicketsToShow]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex items-center">
        <h2 className="text-md font-semibold">티켓 조회</h2>

        {/* 검색 컴포넌트 */}
        <div className="flex items-center space-x-2 ml-4">
          <Search onSearchChange={handleSearchChange} />
        </div>

        <div className="ml-auto flex items-center relative">
          {/* 캘린더 선택 */}
          <button
            className="flex items-center text-sm font-medium text-[#6E61CA] hover:text-[#5A50A8] px-4 py-2 rounded-md"
            onClick={toggleCalendar}
          >
            <span>{formattedDateRange}</span>
            <img
              src="/calendarIcon.png"
              alt="Calendar Icon"
              className="w-5 h-5 ml-2 mb-1"
            />
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
          <FilterNum onSelectCount={handleSelectCount} selectedCount={maxTicketsToShow} />
        </div>
      </div>

      <TicketList_Depart
        tickets={tickets}
        maxTicketsToShow={maxTicketsToShow}
        page={currentPage}
        searchTerm={searchTerm}
        dateRange={dateRange}
      />
    </div>
  );
}
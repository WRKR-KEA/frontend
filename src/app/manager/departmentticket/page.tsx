"use client";

import { useState } from "react";
import { TicketList_Depart } from "../../../components/ticketList_Depart";
import { FilterNum } from "../../../components/filterNum";
import PagePagination from "../../../components/pagination";
import { Search } from "../../../components/search";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // 기본 스타일
import "react-date-range/dist/theme/default.css"; // 테마 스타일
import { format } from "date-fns";
import { ticketDummyData } from "../../../data/ticketDummyData";

export default function DepartmentTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 캘린더 상태 관리
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<any>({
    startDate: null,
    endDate: null,
    key: "selection",
  });

  const [tickets, setTickets] = useState(ticketDummyData); 

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleSelectCount = (count: number) => {
    setMaxTicketsToShow(count);
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
            className="flex items-center text-sm font-medium text-[#6E61CA] hover:text-[#5A50A8] px-4 py-2 rounded-md "
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
          <FilterNum onSelectCount={handleSelectCount} />
        </div>
      </div>

      <TicketList_Depart
        maxTicketsToShow={maxTicketsToShow}
        page={currentPage}
        searchTerm={searchTerm}
        dateRange={dateRange}
      />

      <div className="flex justify-center items-center mt-4">
        <PagePagination
          totalItemsCount={tickets.length}
          itemsCountPerPage={maxTicketsToShow}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
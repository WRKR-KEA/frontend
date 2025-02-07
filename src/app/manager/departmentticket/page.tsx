"use client";

import { useState, useEffect } from "react";
import { TicketList_Depart } from "@/components/Tickets/ticketList_Depart";
import { FilterNum } from "@/components/Filters/filterNum";
import { Search } from "@/components/search";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { fetchManagerDepartmentTicket, fetchManagerDepartmentTicketExcel } from "@/services/manager";
import PagePagination from "@/components/pagination";
import Button from "@/components/Buttons/Button";

export default function DepartmentTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<string>("");  
  const [selectedStatus, setSelectedStatus] = useState<string>("");

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

  const [dateRange, setDateRange] = useState<any>({
    startDate: null,
    endDate: null,
    key: "selection",
  });

  const formattedDateRange = dateRange.startDate
    ? `${format(dateRange.startDate, "yyyy.MM.dd")} - ${format(dateRange.endDate, "yyyy.MM.dd")}`
    : "모든 날짜";
  
  const handleStatusChange = (status: string) => {
    setStatus(status);
    setCurrentPage(1);  // Reset to page 1 when changing status
  };

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchManagerDepartmentTicket(
        searchTerm,
        status,
        dateRange.startDate ? format(dateRange.startDate, "yyyy-MM-dd") : undefined, 
        dateRange.endDate ? format(dateRange.endDate, "yyyy-MM-dd") : undefined, 
        currentPage,
        maxTicketsToShow
      );
      setTickets(data?.result?.elements || []);
      console.log("🎫 부서 티켓 조회", data);
    } catch (err) {
      setError("티켓 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

    // 엑셀 다운로드 핸들러
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
        a.download = "부서_티켓_조회.xlsx"; // 다운로드할 파일 이름
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (error) {
        console.error("엑셀 다운로드 중 오류 발생:", error);
        alert("엑셀 다운로드 중 오류가 발생했습니다.");
      }
    };
  

  useEffect(() => {
    fetchTickets();
  }, [searchTerm, dateRange, currentPage, maxTicketsToShow, status]); // status를 dependency array에 추가

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">티켓 조회</h2>

        {/* 검색 컴포넌트 */}
        <div className="flex items-center space-x-2 ml-4">
          <Search onSearchChange={handleSearchChange} placeHolder="제목, 담당자, 티켓번호" />
        </div>

        <div className="ml-auto flex items-center relative">
          {/* 캘린더 선택 */}
          <button
            className="flex items-center text-sm font-medium text-main-2 hover:text-main-1 px-4 py-2 rounded-md"
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
                ranges={[dateRange]} // startDate와 endDate를 여기서 설정
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
        status={status}  // status 전달
        onStatusChange={handleStatusChange} // 상태 변경 함수 전달
      />

      {/* 다운로드 버튼 추가 */}
      <div className="flex justify-end mb-4">
          <Button
            label="다운로드"
            onClick={handleDownloadExcel}
            color={1} // 파란색
            className="mr-2"
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
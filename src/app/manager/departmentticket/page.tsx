"use client";

import { useState, useEffect, useCallback } from "react";
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
import Skeleton from "@/components/Skeleton";

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
  const [totalItemsCount, setTotalItems] =useState(1);

  const [modalState, setModalState] = useState({
          isOpen: false,
          title: "",
          btnText: "",
          onClose:()=>{},
      })
  
      const showModal = (title: string, btnText='닫기') => {
          setModalState({
            isOpen: true,
            title,
            btnText,
            onClose: () => {
              setModalState(prev => ({ ...prev, isOpen: false }));
            },
      
          });
        };
        
  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
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
    setCurrentPage(1);
  };

  const fetchTickets = useCallback(async () => {
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

      const firstdata = await fetchManagerDepartmentTicket(
        "",
        "",
        dateRange.startDate ? format(dateRange.startDate, "yyyy-MM-dd") : null,
        dateRange.endDate ? format(dateRange.endDate, "yyyy-MM-dd") : null,
        currentPage,
        maxTicketsToShow
      );
      const totalItemsCount =firstdata?.result?.totalElements;
      setTotalItems(totalItemsCount);

      setTickets(data?.result?.elements || []);
      setTotalPages(data?.result?.totalPages || []);
    } catch (err) {
      setError("티켓 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, status, dateRange, currentPage, maxTicketsToShow]);

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
      showModal("엑셀 다운로드 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">티켓 조회</h2>

        <div className="flex items-center space-x-2 ml-4">
          <Search onSearchChange={handleSearchChange} placeHolder="제목, 담당자, 티켓번호" />
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
          <FilterNum onSelectCount={handleSelectCount} selectedCount={maxTicketsToShow} />
        </div>
      </div>

      <div className="relative min-h-[200px]">
      {isLoading || totalItemsCount === 0? (
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

      <div className="flex justify-end mb-4">
        <Button label="다운로드" onClick={handleDownloadExcel} color={1} className="mr-2" />
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
       </>
      )}
    </div>
    </div>
  );
}
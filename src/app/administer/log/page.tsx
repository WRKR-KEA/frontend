"use client";

import { FilterNum } from "@/components/filterNum";
import PagePagination from "@/components/pagination";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface LogEntry {
  id: number;
  timestamp: string;
  user: string;
  email: string;
  status: string;
}

const mockData: LogEntry[] = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  timestamp: "2025-01-22T07:51:21.542Z",
  user: `User${index + 1}`,
  email: `useremail${index + 1}@gmail.com`,
  status: index % 2 === 0 ? "성공" : "실패",
}));

export default function LogPage() {
  const [logs, setLogs] = useState<LogEntry[]>(mockData);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Date Range Picker 관련 상태 및 핸들러
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });

  const handleDateChange = (ranges: any) => {
    setDateRange(ranges.selection);
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  // 날짜 범위 포맷팅
  const formattedDateRange = dateRange.startDate && dateRange.endDate
    ? `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`
    : "모든 날짜";

  const filteredLogs = logs.filter(
    (log) =>
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.status.includes(searchTerm)
  );

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectCount = (count: number) => {
    setCurrentPage(1);
    const updatedLogs = mockData.slice(0, count);
    setLogs(updatedLogs);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        {/* 왼쪽 - 제목과 검색창 */}
        <div className="flex items-center">
          <h2 className="text-md font-semibold">로그 조회</h2>
          <div className="flex items-center space-x-2 ml-4">
            <div className="flex items-center border-b p-2">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="검색어를 입력하세요"
                className="outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* 오른쪽 - 캘린더 버튼과 필터 */}
        <div className="flex items-center space-x-4 relative">
          {/* 캘린더 버튼 */}
          <button
            className="flex items-center text-sm font-medium text-[#6E61CA] hover:text-[#5A50A8] px-2 py-2 rounded-md"
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

          {/* 필터 버튼 */}
          <FilterNum onSelectCount={handleSelectCount} />
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border w-2/12">인덱스</th>
            <th className="p-3 border w-2/12">회원 닉네임</th>
            <th className="p-3 border w-3/12">회원 이메일</th>
            <th className="p-3 border w-3/12">로그인 시도</th>
            <th className="p-3 border w-2/12">상태</th>
          </tr>
        </thead>
        <tbody>
          {paginatedLogs.length > 0 ? (
            paginatedLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="p-3 border w-2/12">{log.id}</td>
                <td className="p-3 border w-2/12">{log.user}</td>
                <td className="p-3 border w-3/12">{log.email}</td>
                <td className="p-3 border w-3/12">{log.timestamp}</td>
                <td className={`p-3 border w-2/12 text-center`}>
                  <span
                    className={`px-7 py-2 rounded text-sm font-semibold ${
                      log.status === "성공"
                        ? "bg-[#00B69B]/20 text-[#00B69B]"
                        : "bg-[#EF3826]/20 text-[#EF3826]"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-3 text-center text-gray-500">
                로그가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center items-center mt-4 w-full">
        <PagePagination
          totalItemsCount={filteredLogs.length}
          itemsCountPerPage={itemsPerPage}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

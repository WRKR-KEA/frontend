"use client";

import { FilterNum } from "@/components/Filters/filterNum";
import PagePagination from "@/components/pagination";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { fetchAdminAccessLogs } from "@/services/admin";
import { format } from 'date-fns';

interface LogEntry {
  id: number;
  timestamp: string;
  user: string;
  email: string;
  ip: string;
  role: string;
  action: string;
  status: string;
}


// const mockData: LogEntry[] = Array.from({ length: 100 }, (_, index) => ({
//   id: index + 1,
//   timestamp: "2025-01-22T07:51:21.542Z",
//   user: `User${index + 1}`,
//   email: `useremail${index + 1}@gmail.com`,
//   ip: `111.234.567.${index + 1}`,
//   role: index % 2 === 0 ? "관리자" : "사용자",
//   action: index % 2 === 0 ? "로그인" : "로그아웃",
//   status: index % 2 === 0 ? "성공" : "실패",
// }));

export default function LogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("전체");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(0); // 🔹 totalPages 상태 추가
  const [totalElements, setTotalElements] = useState(0); // 🔹 전체 요소 개수 추가

  // Date Range Picker 관련 상태 및 핸들러
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });
  //enter 키를 눌렀을 때 API 요청
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("🔍 검색 실행:", searchTerm);
      setCurrentPage(1); // 검색 시 첫 페이지로 이동
      loadLogs(); // 🔹 API 요청 실행
    }
  };

  useEffect(() => {
    loadLogs(); // 🔹[추가] 컴포넌트 마운트 시 로그 불러오기
  }, [activeTab,currentPage,itemsPerPage,dateRange]);

  const loadLogs = async () => {
    try {
      const role =
        activeTab === "전체"
          ? undefined
          : activeTab === "관리자"
          ? "ADMIN"
          : activeTab === "담당자"
          ? "MANAGER"
          : "USER";

      console.log("role잉이이이이이",role)
      const response = await fetchAdminAccessLogs(
        currentPage,
        itemsPerPage,
        role,
        searchTerm,
        undefined,
        dateRange.startDate ? format(dateRange.startDate, "yyyy-MM-dd") : undefined,
        dateRange.endDate ? format(dateRange.endDate, "yyyy-MM-dd") : undefined
      );

      console.log("📌 가져온 로그 데이터:", response);

      if (response?.result?.elements) {
        setLogs(
          response.result.elements.map((log: any) => ({
            id: log.accessLogId,
            user: log.nickname,
            email: log.email || "N/A",
            ip: log.ip,
            role: log.role,
            action: log.action, // 🔹 추가: 로그인/로그아웃
            timestamp: new Date(log.accessAt).toLocaleString(),
            status: log.isSuccess ? "성공" : "실패",
          }))
        );
        setTotalPages(response.result.totalPages); // 🔹 totalPages 적용
        setTotalElements(response.result.totalElements); // 🔹 전체 요소 개수 설정
      } else {
        setLogs([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error("❌ 로그 데이터 조회 실패:", error);
    }
  };

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

  // const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectCount = (count: number) => {
    setitemsPerPage(count);
    setCurrentPage(1); // 페이지네이션도 첫 페이지로 이동
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    setCurrentPage(1);
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
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="닉네임, IP 검색"
                className="outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* 오른쪽 - 캘린더 버튼과 필터 */}
        <div className="flex items-center space-x-4 relative">
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
          <FilterNum onSelectCount={handleSelectCount} selectedCount={itemsPerPage} />
        </div>
      </div>

      {/* 역할 선택 탭 */}
      <div className="flex items-center border-b mt-4">
        {["전체", "관리자", "담당자", "사용자"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`w-32 text-center py-3 font-semibold ${
              activeTab === tab
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border w-1/12">ID</th>
            <th className="p-3 border w-2/12">회원 닉네임</th>
            <th className="p-3 border w-2/12">IP</th>
            <th className="p-3 border w-3/12">접근 시간</th>
            <th className="p-3 border w-2/12">접근 유형</th>
            <th className="p-3 border w-2/12">상태</th>
          </tr>
        </thead>
        <tbody>
          {logs.slice(0, itemsPerPage).map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="p-3 border">{log.id}</td>
              <td className="p-3 border">{log.user}</td>
              <td className="p-3 border">{log.ip}</td>
              <td className="p-3 border">{log.timestamp}</td>
              <td className="p-3 border">{log.action}</td>
              <td className="p-3 border text-center">
                <span className={`px-7 py-2 rounded text-sm font-semibold ${log.status === "성공" ? "bg-[#00B69B]/20 text-[#00B69B]" : "bg-[#EF3826]/20 text-[#EF3826]"}`}>
                  {log.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center mt-4 w-full">
        <PagePagination totalItemsCount={totalElements} itemsCountPerPage={itemsPerPage} pageRangeDisplayed={5} onPageChange={(page) => setCurrentPage(page)} currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}

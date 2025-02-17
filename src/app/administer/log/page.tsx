"use client";

import { FilterNum } from "@/components/Filters/filterNum";
import PagePagination from "@/components/pagination";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { fetchAdminAccessLogs, fetchAdminAccessLogsExcel } from "@/services/admin";
import Button from "@/components/Buttons/Button";
import { format } from 'date-fns';
import axios from "axios";
import { HighlightText } from "@/components/highlightText";
import Skeleton from "@/components/Skeleton";

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

;

export default function LogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("전체");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(0); // 🔹 totalPages 상태 추가
  const [totalElements, setTotalElements] = useState(0); // 🔹 전체 요소 개수 추가
  const [searchTrigger, setSearchTrigger] = useState(""); // ✅ Enter 입력 후 실행할 검색어
  // Date Range Picker 관련 상태 및 핸들러
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [logisLoading, setLogisLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };



  //enter 키를 눌렀을 때 API 요청
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("🔍 검색 실행:", searchTerm);
      setSearchTrigger(searchTerm); // ✅ 현재 검색어로 실행
      setCurrentPage(1); // 검색 시 첫 페이지로 이동
      loadLogs(); // 🔹 API 요청 실행
    }
  };

  const handleSearch = () => {
    setSearchTrigger(searchTerm); // ✅ 현재 검색어로 실행
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  
};

  
  useEffect(() => {
    loadLogs(); // 🔹[추가] 컴포넌트 마운트 시 로그 불러오기
  }, [activeTab, currentPage, itemsPerPage, dateRange]);

  const loadLogs = async () => {
    try {
      
      const response = await fetchAdminAccessLogs(
        currentPage,
        itemsPerPage,
        searchTerm,
        dateRange.startDate ? format(dateRange.startDate, "yyyy-MM-dd") : undefined,
        dateRange.endDate ? format(dateRange.endDate, "yyyy-MM-dd") : undefined
      );

      console.log("📌 가져온 로그 데이터:", response);

      if (response?.result?.elements) {
        setLogs(
          response.result.elements.map((log: any) => ({
            id: log.accessLogId,
            user: log.nickname,
            ip: log.ip,
            action: log.action, // 🔹 추가: 로그인/로그아웃
            timestamp: new Date(log.accessAt).toLocaleString(),
            status: log.isSuccess ? "성공" : "실패",
          }))
        );
        setTotalPages(response.result.totalPages); // 🔹 totalPages 적용
        setTotalElements(response.result.totalElements); // 🔹 전체 요소 개수 설정
        setLogisLoading(false)
      } else {
        setLogs([]);
        setTotalPages(0);
        setTotalElements(0);
        setLogisLoading(false)
      }
    } catch (error) {
      console.error("❌ 로그 데이터 조회 실패:", error);
    }
  };

  const handleDateChange = (ranges: any) => {
    setCurrentPage(1)
    setDateRange(ranges.selection);
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  // 날짜 범위 포맷팅
  const formattedDateRange = dateRange.startDate && dateRange.endDate
    ? `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`
    : "모든 날짜";



  const handleSelectCount = (count: number) => {
    setitemsPerPage(count);
    setCurrentPage(1); // 페이지네이션도 첫 페이지로 이동
  };
const datepickerRef = useRef(null); // ✅ 캘린더 감지용 ref

  useEffect(() => {
          const handleClickOutside = (event) => {
              if (datepickerRef.current && !datepickerRef.current.contains(event.target)) {
                  setIsCalendarOpen(false);
              }
          };
  
          if (isCalendarOpen) {
              document.addEventListener("mousedown", handleClickOutside);
          } else {
              document.removeEventListener("mousedown", handleClickOutside);
          }
  
          return () => {
              document.removeEventListener("mousedown", handleClickOutside);
          };
      }, [isCalendarOpen]);


  // LogPage 컴포넌트의 handleDownloadExcel 함수 수정
  const handleDownloadExcel = async () => {
    try {
      const data = await fetchAdminAccessLogsExcel(
        searchTerm,
        dateRange.startDate ? format(dateRange.startDate, "yyyy-MM-dd") : undefined,
        dateRange.endDate ? format(dateRange.endDate, "yyyy-MM-dd") : undefined
      );

      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `access_logs_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("엑셀 다운로드 중 오류 발생:", error);
      alert("엑셀 다운로드 중 오류가 발생했습니다.");
    }
  };

  if (logisLoading) {
    return <Skeleton width="100%" height="100%"/>
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        {/* 왼쪽 - 제목과 검색창 */}
        <div className="flex items-center">
          <h2 className="text-md font-semibold">로그 조회</h2>
          <div className="flex items-center space-x-2 ml-4">
            <div className="flex items-center border-b p-2">
              
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onBlur={handleSearch}
                placeholder="회원 아이디, IP 검색"
                className="outline-none text-sm"
              />
              <FaSearch className="text-gray-500 mr-2" />
            </div>
          </div>
        </div>

        {/* 오른쪽 - 캘린더 버튼과 필터 */}
        <div ref={datepickerRef}  className="flex items-center space-x-4 relative">
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



      <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border w-1/12">ID</th>
            <th className="p-3 border w-2/12">회원 아이디</th>
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
              <td className="p-3 border">
                <HighlightText text={log.user} highlight={searchTrigger} />
              </td>
              <td className="p-3 border">
                <HighlightText text={log.ip} highlight={searchTrigger} />
              </td>
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

      {
        logs.length > 0 ? (
          <>
            <div className="flex justify-end mt-4">
              <Button
                label="다운로드"
                onClick={handleDownloadExcel}
                color={1} // 파란색
                className="mr-2"
              />
            </div>
            <div className="flex justify-center items-center mt-4 w-full">
              <PagePagination totalItemsCount={totalElements} itemsCountPerPage={itemsPerPage} pageRangeDisplayed={5} onPageChange={(page) => setCurrentPage(page)} currentPage={currentPage} totalPages={totalPages} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <p className="text-lg">검색 결과가 없습니다.</p>
          </div>
        )
      }

    </div>
  );
}

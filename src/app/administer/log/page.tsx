"use client";

import PagePagination from "@/components/pagination";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // 돋보기 아이콘

interface LogEntry {
  id: number;
  timestamp: string;
  user: string;
  email: string;
  status: string; // 로그인 성공/실패 여부 추가
}

const mockData: LogEntry[] = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  timestamp: "2025-01-22T07:51:21.542Z",
  user: `User${index + 1}`,
  email: `useremail${index + 1}@gmail.com`,
  status: index % 2 === 0 ? "성공" : "실패", // 짝수는 성공, 홀수는 실패
}));

export default function LogPage() {
  const [logs, setLogs] = useState<LogEntry[]>(mockData);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>(""); // 검색 입력 상태
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

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
    setSearchTerm(e.target.value); // 검색 상태 업데이트
    setCurrentPage(1); // 검색 시 페이지를 첫 페이지로 초기화
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value); // 검색 입력 상태 업데이트
    handleSearchChange(e); // 검색 함수 호출
  };

  return (
    <div className="p-6">
      <div className="flex items-center">
        <h2 className="text-md font-semibold">로그 조회</h2>
        <div className="flex items-center space-x-2 ml-4">
          <div className="flex items-center border-b p-2">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              placeholder="검색어를 입력하세요"
              className="outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden">
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

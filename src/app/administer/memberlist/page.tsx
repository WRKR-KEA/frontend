"use client";

import { Search } from "@/components/search";
import PagePagination from "@/components/pagination";
import { useState } from "react";

export default function AdminMemberListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [activeTab, setActiveTab] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const handleTabClick = (tabName: string) => setActiveTab(tabName);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };
  const handleSearchChange = (term: string) => setSearchTerm(term);

  const data = [
    {
      avatar: "/userProfileImage.png",
      name: "어피치",
      role: "사용자",
      phone: "010-0000-0000",
      email: "michelle.rivera@example.com",
    },
    {
      avatar: "/userProfileImage.png",
      name: "라이언",
      role: "담당자",
      phone: "010-0000-0000",
      email: "debbie.baker@example.com",
    },
    {
      avatar: "/userProfileImage.png",
      name: "콘",
      role: "사용자",
      phone: "010-0000-0000",
      email: "kenzi.lawson@example.com",
    },
    {
      avatar: "/userProfileImage.png",
      name: "무지",
      role: "담당자",
      phone: "010-0000-0000",
      email: "nathan.roberts@example.com",
    },{
      avatar: "/userProfileImage.png",
      name: "어피치",
      role: "사용자",
      phone: "010-0000-0000",
      email: "michelle.rivera@example.com",
    },
    {
      avatar: "/userProfileImage.png",
      name: "라이언",
      role: "담당자",
      phone: "010-0000-0000",
      email: "debbie.baker@example.com",
    },
    {
      avatar: "/userProfileImage.png",
      name: "콘",
      role: "사용자",
      phone: "010-0000-0000",
      email: "kenzi.lawson@example.com",
    },
    {
      avatar: "/userProfileImage.png",
      name: "무지",
      role: "담당자",
      phone: "010-0000-0000",
      email: "nathan.roberts@example.com",
    },{
      avatar: "/userProfileImage.png",
      name: "어피치",
      role: "사용자",
      phone: "010-0000-0000",
      email: "michelle.rivera@example.com",
    },
    {
      avatar: "/userProfileImage.png",
      name: "라이언",
      role: "담당자",
      phone: "010-0000-0000",
      email: "debbie.baker@example.com",
    },
    {
      avatar: "/userProfileImage.png",
      name: "콘",
      role: "사용자",
      phone: "010-0000-0000",
      email: "kenzi.lawson@example.com",
    },
    {
      avatar: "/userProfileImage.png",
      name: "무지",
      role: "담당자",
      phone: "010-0000-0000",
      email: "nathan.roberts@example.com",
    },
  ];

  // 필터링된 데이터
  const filteredData = data.filter((user) => {
    if (activeTab === "전체") return true; // "전체" 탭은 모든 데이터를 보여줌
    return user.role === activeTab;
  });

  return (
    <div className="flex flex-col bg-white p-4 rounded-md w-full">
      <div className="flex items-center">
        <h2 className="text-md font-semibold">회원 조회</h2>
        <Search onSearchChange={handleSearchChange} />
      </div>

      <div className="flex flex-col w-full mt-2">
        <div className="flex items-center border-b">
          {["전체", "사용자", "담당자"].map((tab) => (
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
          <button className="ml-auto px-3 py-2 border-2 border-[#4B5FC2] text-[#4B5FC2] rounded-md hover:bg-[#4B5FC2] hover:text-white transition">
            회원 삭제
          </button>
        </div>

        <div className="mt-3">
          <table className="w-full table-fixed border-collapse rounded-md">
            <thead>
              <tr>
                <th className="p-3 w-1/12"></th>
                <th className="p-3 text-left w-2/12">이름</th>
                <th className="p-3 text-left w-2/12">직책</th>
                <th className="p-3 text-left w-2/12">전화번호</th>
                <th className="p-3 text-left w-3/12">이메일 주소</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[#6E61CA]/20" : ""}
                >
                  <td className="p-3 w-1/12">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3 w-2/12">
                    <div className="flex items-center space-x-3">
                      <img
                        src={row.avatar}
                        alt={row.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{row.name}</span>
                    </div>
                  </td>
                  <td className="p-4 w-2/12">{row.role}</td>
                  <td className="p-4 w-2/12">{row.phone}</td>
                  <td className="p-4 w-3/12">{row.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          <PagePagination
            totalItemsCount={filteredData.length}
            itemsCountPerPage={maxTicketsToShow}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

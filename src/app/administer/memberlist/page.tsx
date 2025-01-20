"use client";

import { Search } from "@/components/search";
import PagePagination from "@/components/pagination";
import MemberList from "@/components/MemberList";
import { useState } from "react";

export default function AdminMemberListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState<number>(20);
  const [activeTab, setActiveTab] = useState("Tab1");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const data = [
    {
      avatar: "/userProfileImage.png",
      name: "어피치",
      subject: "Chemistry",
      phone: "010-0000-0000",
      email: "michelle.rivera@example.com",
      tickets: 74,
    },
    {
      avatar: "/userProfileImage.png",
      name: "라이언",
      subject: "French",
      phone: "010-0000-0000",
      email: "debbie.baker@example.com",
      tickets: 34,
    },
    {
      avatar: "/userProfileImage.png",
      name: "콘",
      subject: "Maths",
      phone: "010-0000-0000",
      email: "kenzi.lawson@example.com",
      tickets: 65,
    },
    {
      avatar: "/userProfileImage.png",
      name: "무지",
      subject: "English",
      phone: "010-0000-0000",
      email: "nathan.roberts@example.com",
      tickets: 8,
    },
    {
        avatar: "/userProfileImage.png",
        name: "어피치",
        subject: "Chemistry",
        phone: "010-0000-0000",
        email: "michelle.rivera@example.com",
        tickets: 74,
      },
      {
        avatar: "/userProfileImage.png",
        name: "라이언",
        subject: "French",
        phone: "010-0000-0000",
        email: "debbie.baker@example.com",
        tickets: 34,
      },
      {
        avatar: "/userProfileImage.png",
        name: "콘",
        subject: "Maths",
        phone: "010-0000-0000",
        email: "kenzi.lawson@example.com",
        tickets: 65,
      },
      {
        avatar: "/userProfileImage.png",
        name: "무지",
        subject: "English",
        phone: "010-0000-0000",
        email: "nathan.roberts@example.com",
        tickets: 8,
      },
      {
        avatar: "/userProfileImage.png",
        name: "어피치",
        subject: "Chemistry",
        phone: "010-0000-0000",
        email: "michelle.rivera@example.com",
        tickets: 74,
      },
      {
        avatar: "/userProfileImage.png",
        name: "라이언",
        subject: "French",
        phone: "010-0000-0000",
        email: "debbie.baker@example.com",
        tickets: 34,
      },
      {
        avatar: "/userProfileImage.png",
        name: "콘",
        subject: "Maths",
        phone: "010-0000-0000",
        email: "kenzi.lawson@example.com",
        tickets: 65,
      },
      {
        avatar: "/userProfileImage.png",
        name: "무지",
        subject: "English",
        phone: "010-0000-0000",
        email: "nathan.roberts@example.com",
        tickets: 8,
      },
  ];

  return (
    <div className="flex flex-col bg-white p-4 rounded-md w-full">
      <div className="flex items-center">
        <h2 className="text-md font-semibold">회원 조회</h2>
        <div className="flex items-center space-x-2 ml-4">
          <Search onSearchChange={handleSearchChange} />
        </div>
      </div>

      <div className="flex flex-col items-start w-full mx-auto mt-2">
        <div className="flex border-gray-200 w-full items-center">
          <button
            onClick={() => handleTabClick("Tab1")}
            className={`w-32 text-center py-3 px-4 font-semibold text-sm ${
              activeTab === "Tab1" ? "border-b-2 border-black text-black" : "text-gray-500"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => handleTabClick("Tab2")}
            className={`w-32 text-center py-3 px-4 font-semibold text-sm ${
              activeTab === "Tab2" ? "border-b-2 border-black text-black" : "text-gray-500"
            }`}
          >
            사용자
          </button>
          <button
            onClick={() => handleTabClick("Tab3")}
            className={`w-32 text-center py-3 px-4 font-semibold text-sm ${
              activeTab === "Tab3" ? "border-b-2 border-black text-black" : "text-gray-500"
            }`}
          >
            담당자
          </button>

          <button className="ml-auto px-3 py-2 border-2 border-[#4B5FC2] text-[#4B5FC2] bg-white rounded-md hover:bg-[#4B5FC2] hover:text-white transition">
            회원 삭제
          </button>
        </div>

        <MemberList data={data} />

        <div className="flex justify-center items-center mt-4 w-full">
          <PagePagination
            totalItemsCount={1000}
            itemsCountPerPage={maxTicketsToShow}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

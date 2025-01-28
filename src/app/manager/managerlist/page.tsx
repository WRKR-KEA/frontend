"use client";

import { Search } from "@/components/search";
import PagePagination from "@/components/pagination";
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


                <div className="w-full mx-auto mt-3">
                    <table className="w-full table-fixed border-collapse border border-gray-300 rounded-md overflow-hidden">
                        <thead>
                            <tr>
                                <th className="p-3 text-left w-1/12"></th>
                                <th className="p-3 text-left w-2/12">이름</th>
                                <th className="p-3 text-left w-2/12">직책</th>
                                <th className="p-3 text-left w-2/12">전화번호</th>
                                <th className="p-3 text-left w-3/12">이메일 주소</th>
                                <th className="p-3 text-left w-2/12">담당 티켓</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "bg-[#6E61CA]/20" : ""}
                                >
                                    <td className="p-3 w-1/12"></td>
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
                                    <td className="p-4 w-2/12">{row.subject}</td>
                                    <td className="p-4 w-2/12">{row.phone}</td>
                                    <td className="p-4 w-3/12">{row.email}</td>
                                    <td className="p-4 w-2/12">{row.tickets}</td> 
                                </tr>
                            ))}
                        </tbody>
                    </table>


                </div>

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

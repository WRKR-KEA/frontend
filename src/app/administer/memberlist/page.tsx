"use client";

import { useState } from "react";

export default function AdminMemberListPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false); // 필터 드롭다운 상태

    const toggleFilter = () => {
        setIsFilterOpen((prev) => !prev); // 필터 상태 토글
    };

    const [activeTab, setActiveTab] = useState("Tab1");

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
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
        <div className="flex flex-col items-center bg-white p-4 rounded-md w-full">
            {/* 상단 검색 및 필터 영역 */}
            <div className="flex items-center justify-between w-full">
                {/* 필터 버튼 */}
                <div className="relative">
                    <button
                        onClick={toggleFilter}
                        className="flex items-center px-4 py-4 border border-gray-300 rounded-md text-sm hover:bg-gray-100 focus:outline-none"
                    >
                        전체
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {/* 필터 드롭다운 */}
                    {isFilterOpen && (
                        <ul className="absolute mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                이메일
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                이름
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                부서
                            </li>
                        </ul>
                    )}
                </div>

                {/* 검색바 */}
                <div className="flex-grow flex items-center bg-gray-100 px-4 py-4 rounded-md text-gray-500 ml-4">
                    <img src="/search.png" className="w-5" />
                    <input
                        type="text"
                        placeholder="Search for teachers by name or email"
                        className="w-full bg-transparent text-sm focus:outline-none ml-2"
                    />
                </div>
            </div>


            <div className="flex flex-col items-start w-full mx-auto mt-2">
                {/* 탭 버튼 리스트 */}
                <div className="flex border-gray-200 w-full items-center">
                    {/* 탭 리스트 */}
                    <button
                        onClick={() => handleTabClick("Tab1")}
                        className={`w-32 text-center py-3 px-4 font-semibold text-sm ${activeTab === "Tab1"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500"
                            }`}
                    >
                        전체
                    </button>
                    <button
                        onClick={() => handleTabClick("Tab2")}
                        className={`w-32 text-center py-3 px-4 font-semibold text-sm ${activeTab === "Tab2"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500"
                            }`}
                    >
                        사용자
                    </button>
                    <button
                        onClick={() => handleTabClick("Tab3")}
                        className={`w-32 text-center py-3 px-4 font-semibold text-sm ${activeTab === "Tab3"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500"
                            }`}
                    >
                        담당자
                    </button>

                    {/* 오른쪽 끝 파란색 버튼 */}
                    <button className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600">
                        추가
                    </button>
                </div>


                {/* 탭 콘텐츠 */}
                {/* <div className="mt-4 w-full p-6 bg-gray-50 rounded-md shadow-md">
          {activeTab === "Tab1" && <div>Tab 1 Content</div>}
          {activeTab === "Tab2" && <div>Tab 2 Content</div>}
          {activeTab === "Tab3" && <div>Tab 3 Content</div>}
        </div> */}


                <div className="w-full mx-auto mt-3">
                    <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden">
                        <thead>
                            <tr>
                                {/* 체크박스 헤더 */}
                                <th className="p-3 text-left">
                                    <input type="checkbox" />
                                </th>
                                <th className="p-3 text-left">이름</th>
                                <th className="p-3 text-left">직책</th>
                                <th className="p-3 text-left">전화번호</th>
                                <th className="p-3 text-left">이메일 주소</th>
                                <th className="p-3 text-left">담당 티켓</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "bg-[#6E61CA]/20" : ""}
                                >
                                    {/* 체크박스 컬럼 */}
                                    <td className="p-3">
                                        <input type="checkbox" />
                                    </td>
                                    <td className="p-3 flex items-center space-x-3">
                                        <img
                                            src={row.avatar}
                                            alt={row.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span>{row.name}</span>
                                    </td>
                                    <td className="p-4">{row.subject}</td>
                                    <td className="p-4">{row.phone}</td>
                                    <td className="p-4">{row.email}</td>
                                    <td className="p-4">{row.tickets}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

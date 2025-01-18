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


    const handleSelectCount = (count: number) => {
        setMaxTicketsToShow(count);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // 페이지 변경 시 스크롤 맨 위로 이동
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
            {/* 상단 검색 및 필터 영역 */}<div className="flex items-center">


                <h2 className="text-md font-semibold">회원 조회</h2>

                {/* 검색 컴포넌트 추가 */}
                <div className="flex items-center space-x-2 ml-4">
                    <Search onSearchChange={handleSearchChange} />
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
                    <button className="ml-auto px-3 py-2 border-2 border-[#4B5FC2] text-[#4B5FC2] bg-white rounded-md hover:bg-[#4B5FC2] hover:text-white transition">
                        회원 삭제
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

"use client";

import { Search } from "@/components/search";
import PagePagination from "@/components/pagination";
import { useState } from "react";
import { useManagerListQuery } from "@/hooks/useManagerList"; // useManagerListQuery 훅 import

export default function AdminMemberListPage() {
    const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
    };

    // useManagerListQuery 훅 사용
    const { data: members, isLoading, error } = useManagerListQuery();

    if (isLoading) return <p>로딩 중...</p>;
    if (error) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

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
                    <table className="w-full table-fixed border-collapse rounded-md overflow-hidden">
                        <thead>
                            <tr>
                                <th className="p-3 text-left w-1/12"></th>
                                <th className="p-3 text-left w-2/12">이름</th>
                                <th className="p-3 text-left w-2/12">직책</th>
                                <th className="p-3 text-left w-2/12">전화번호</th>
                                <th className="p-3 text-left w-3/12">이메일 주소</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members?.map((row: any, index: number) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "bg-[#6E61CA]/20" : ""}
                                >
                                    <td className="p-3 w-1/12"></td>
                                    <td className="p-3 w-2/12">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={row.avatar || "/userProfileImage.png"}
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

                <div className="flex justify-center items-center mt-4 w-full">
                    <PagePagination
                        totalItemsCount={members?.length || 0}
                        itemsCountPerPage={maxTicketsToShow}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
}

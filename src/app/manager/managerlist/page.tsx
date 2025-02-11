"use client";

import { useState } from "react";
import PagePagination from "@/components/pagination";
import { useManagerListQuery } from "@/hooks/useManagerList";
import { FilterNum } from "@/components/Filters/filterNum";

export default function AdminMemberListPage() {
    const [maxTicketsToShow, setMaxTicketsToShow] = useState(10); // 한 페이지에 표시할 개수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

    // ✅ 페이지 변경 핸들러
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // 페이지 이동 시 스크롤 상단 이동
    };

    // ✅ 검색어 변경 핸들러
    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
    };

    // ✅ size 변경 핸들러 (필터 적용)
    const handleSizeChange = (size: number) => {
        setMaxTicketsToShow(size);
        setCurrentPage(1); // size 변경 시 첫 페이지로 이동
    };

    // ✅ useManagerListQuery 훅 사용
    const { data: members, isLoading, error } = useManagerListQuery({
        page: currentPage , // ✅ 백엔드가 0부터 시작하면 -1
        size: maxTicketsToShow, // ✅ 한 페이지당 표시할 개수
    });

    const handleSelectCount = (count: number) => {
        setMaxTicketsToShow(count);
        setCurrentPage(1); // 페이지 초기화
      };

    console.log("✅ API 응답:", members);

    if (isLoading) return <p>로딩 중...</p>;
    if (error) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

    return (
        <div className="flex flex-col bg-white p-4 rounded-md w-full">
            {/* ✅ 상단 컨트롤 바 */}
            <div className="flex items-center justify-between">
                <h2 className="text-md font-semibold">회원 조회</h2>

                <div className="flex items-center space-x-4">
                <FilterNum onSelectCount={handleSelectCount} selectedCount={maxTicketsToShow} />
                </div>
            </div>

            {/* ✅ 테이블 */}
            <div className="flex flex-col items-start w-full mx-auto mt-2">
                <div className="w-full mx-auto mt-3">
                    <table className="w-full table-fixed border-collapse rounded-md overflow-hidden">
                        <thead>
                            <tr>
                                <th className="p-3 text-left w-1/12"></th>
                                <th className="p-3 text-left w-2/12">닉네임</th>
                                <th className="p-3 text-left w-2/12">직책</th>
                                <th className="p-3 text-left w-2/12">전화번호</th>
                                <th className="p-3 text-left w-3/12">이메일 주소</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members?.result.elements.map((row: any, index: number) => (
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
                                            <span>{row.nickname}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 w-2/12">{row.position}</td>
                                    <td className="p-4 w-2/12">{row.phoneNumber}</td>
                                    <td className="p-4 w-3/12">{row.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ✅ 페이지네이션 */}
                <div className="flex justify-center items-center mt-4 w-full">
                <PagePagination
                    totalItemsCount={members.result.elements.length}
                    itemsCountPerPage={maxTicketsToShow}
                    pageRangeDisplayed={5}
                    currentPage={currentPage}
                    totalPages={members.result.totalPages}
                    onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
}

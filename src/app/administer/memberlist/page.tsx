"use client";

import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useMemberListQuery } from "@/hooks/useMemberList";
import PagePagination from "@/components/pagination";
import Link from "next/link";

export default function AdminMemberListPage() {
  const [activeTab, setActiveTab] = useState("전체"); // 역할 선택 (탭)
  const [currentPage, setCurrentPage] = useState(1); // 페이지네이션
  const [searchInput, setSearchInput] = useState(""); // 검색 입력 필드
  const [filters, setFilters] = useState({
    email: "",
    name: "",
    department: "",
  });

  // ✅ 역할 선택 시 role 변경 (탭 클릭)
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    setCurrentPage(1); // 역할 변경 시 첫 페이지로 이동
  };

  // ✅ 페이지네이션 변경
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  // ✅ 검색 입력 필드 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // ✅ 검색 입력 후 0.5초(500ms) 동안 추가 입력이 없으면 검색 수행
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const [email, name, department] = searchInput.split(" ").filter(Boolean);
      setFilters({ email: email || "", name: name || "", department: department || "" });
      setCurrentPage(1); // 검색 시 첫 페이지로 이동
    }, 500);

    return () => clearTimeout(timeoutId); // 새로운 입력이 있으면 기존 타이머 삭제
  }, [searchInput]);

  // ✅ 역할(role) 매핑 함수
  const getRoleQuery = () => {
    if (activeTab === "사용자") return "USER";
    if (activeTab === "담당자") return "MANAGER";
    return undefined; // 전체일 경우 role을 아예 제거 (쿼리에 포함되지 않도록)
  };

  // ✅ useMemberListQuery 훅 사용 (동적 파라미터 적용)
  const { data: members, isLoading, error } = useMemberListQuery({
    page: currentPage,
    size: 10, // 항상 10으로 고정
    role: getRoleQuery(), // 역할 매핑
    ...filters, // 검색 필터 (email, name, department)
  });

  console.log(members);
  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <div className="flex flex-col bg-white p-4 rounded-md w-full">
      <div className="flex items-center">
        <h2 className="text-md font-semibold">회원 조회</h2>

        <div className="flex items-center border-b p-2">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            placeholder="이메일, 이름, 부서"
            className="outline-none text-sm w-[120px]"
          />
        </div>
      </div>

      <div className="flex flex-col w-full mt-2">
        <div className="flex items-center border-b">
          {["전체", "사용자", "담당자"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`w-32 text-center py-3 font-semibold ${activeTab === tab
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
              {members?.elements?.map((row: any, index: number) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[#6E61CA]/20" : ""}
                >
                  <td className="p-3 w-1/12">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3 w-2/12">
    

                    <Link href={`memberlist/${row.memberId}`} className="cursor-pointer hover:underline">
                      <div className="flex items-center space-x-3">
                        <img
                          src={"/userProfileImage.png"}
                          alt={row.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{row.name}</span>
                      </div>
                    </Link>

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
            totalItemsCount={members?.totalElements || 0}
            itemsCountPerPage={members?.size || 10}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

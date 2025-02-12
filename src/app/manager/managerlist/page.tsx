"use client";

import { useManagerListQuery } from "@/hooks/useManagerList";

export default function AdminMemberListPage() {
    // ✅ API에서 가져온 데이터
    const { data: managers, isLoading, error } = useManagerListQuery();

    if (isLoading) return <p>로딩 중...</p>;
    if (error) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

    console.log("📌 최종 관리자 목록:", managers);
    return (
      <div className="flex flex-col bg-white p-4 rounded-md w-full">
          {/* ✅ 상단 컨트롤 바 */}
          <div className="flex items-center justify-between">
              <h2 className="text-md font-semibold">회원 조회</h2>
          </div>

          {/* ✅ 테이블 */}
          <div className="flex flex-col items-start w-full mx-auto mt-5">
              <table className="w-full table-fixed border-collapse rounded-md text-sm overflow-hidden">
                  <thead className="bg-gray-200">
                  <tr>
                      <th className="px-4 py-2 w-auto text-left">아이디</th>
                      <th className="px-4 py-2 w-24 text-left">직책</th>
                      <th className="px-4 py-2 w-40 text-left">전화번호</th>
                      <th className="px-4 py-2 w-78 text-left">이메일 주소</th>
                      <th className="px-4 py-2 w-24 text-right">담당 티켓</th>
                  </tr>
                  </thead>
                  <tbody>
                  {managers.map((row: any, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-component" : ""}>
                        <td className="px-4 py-2">
                            <div className="flex items-center space-x-3">
                                <img
                                  src={row.profileUrl || "/userProfileImage.png"}
                                  alt={row.nickname}
                                  className="w-8 h-8 rounded-full"
                                />
                                <span className="truncate">{row.nickname}</span>
                            </div>
                        </td>
                        <td className="px-4 py-2">{row.position}</td>
                        <td className="px-4 py-2">{row.phoneNumber}</td>
                        <td className="px-4 py-2 truncate">{row.email}</td>
                        <td className="px-4 py-2 text-right">{row.ticketAmount}</td>
                    </tr>
                  ))}
                  </tbody>
              </table>
          </div>
      </div>
    );
}
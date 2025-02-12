"use client";

import { useManagerListQuery } from "@/hooks/useManagerList";

export default function AdminMemberListPage() {
    // ✅ API에서 가져온 데이터
    const { data, isLoading, error } = useManagerListQuery();

    if (isLoading) return <p>로딩 중...</p>;
    if (error) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

    // ✅ 데이터가 없는 경우 빈 배열을 기본값으로 설정
    const managers = data?.managers || [];
    const principal = data?.principal || null;

    // ✅ 본인(principal) 제외한 관리자 목록 필터링
    const filteredManagers = principal
      ? managers.filter((manager: any) => manager.memberId !== principal.memberId)
      : managers;

    // ✅ principal이 존재하면 가장 위에 추가
    const sortedManagers = principal ? [principal, ...filteredManagers] : filteredManagers;

    console.log("📌 최종 관리자 목록:", sortedManagers);

    return (
      <div className="flex flex-col bg-white p-4 rounded-md w-full">
          {/* ✅ 상단 컨트롤 바 */}
          <div className="flex items-center justify-between">
              <h2 className="text-md font-semibold">회원 조회</h2>
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
                      {sortedManagers.map((row: any, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-component" : ""}>
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
          </div>
      </div>
    );
}
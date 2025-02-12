import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchManagerList = async () => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken) throw new Error("인증 토큰이 없습니다.");

  console.log(`📌 요청: /api/manager/members`);

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/manager/members`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  console.log("✅ 응답 데이터:", response.data);

  // ✅ 데이터가 없는 경우 빈 배열을 기본값으로 설정
  const managers = response.data?.result.managers || [];
  const principal = response.data?.result.principal || null;

  // ✅ 본인(principal) 제외한 관리자 목록 필터링
  const filteredManagers = principal
    ? managers.filter((manager: any) => manager.memberId !== principal.memberId)
    : managers;

  // ✅ principal이 존재하면 가장 위에 추가
  return principal ? [principal, ...filteredManagers] : filteredManagers
};

export const useManagerListQuery = () => {
  return useQuery({
    queryKey: ["manager_list"],
    queryFn: fetchManagerList,
  });
};
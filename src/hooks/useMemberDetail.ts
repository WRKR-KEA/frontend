import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ✅ 멤버 상세 정보를 가져오는 API 호출 함수
const fetchMemberDetail = async (memberId: string) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token is missing. Please log in again.");
  }

  const response = await axios.get(
    `http://172.16.211.53:8080/api/admin/members/${memberId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log("🔹 멤버 상세 데이터 응답:", response);
  return response.data.result; // 필요한 데이터만 반환
};

// ✅ React Query 훅 생성
export const useMemberDetailQuery = (memberId: string) => {
  return useQuery({
    queryKey: ["member_detail", memberId], // 캐싱 키에 memberId 포함
    queryFn: () => fetchMemberDetail(memberId),
    enabled: !!memberId, // memberId가 있을 때만 쿼리 실행
    retry: false, // 요청 실패 시 재시도 비활성화 (필요에 따라 조정 가능)
    staleTime: 5 * 60 * 1000, // 데이터가 오래되지 않도록 5분 캐싱
  });
};

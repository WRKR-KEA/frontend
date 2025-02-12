import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ✅ 가이드(도움말) 정보를 가져오는 API 호출 함수
const fetchGuide = async (categoryId: string) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token is missing. Please log in again.");
  }


  const response = await axios.get(
    `http://172.16.211.53:8080/api/user/guide/${categoryId}`, // ✅ API 경로 변경
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log("🌟 가이드응답!",response)
  return response.data; // 필요한 데이터만 반환
};

// ✅ React Query 훅 생성
export const useGuideQuery = (categoryId: string) => {
  return useQuery({
    queryKey: ["guide_detail", categoryId], // ✅ 가이드 캐싱 키 설정
    queryFn: () => fetchGuide(categoryId),
    enabled: !!categoryId, // ✅ categoryId가 있을 때만 실행
    retry: false, // ✅ 실패 시 재시도 비활성화 (필요 시 true)
  });
};

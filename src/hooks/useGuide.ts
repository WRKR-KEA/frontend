import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ✅ 가이드(도움말) 정보를 가져오는 API 호출 함수
const fetchGuide = async (categoryId: string) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token is missing. Please log in again.");
  }


  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/guide/${categoryId}`, // ✅ API 경로 변경
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log("가이드응답!",response)
  return response.data; // 필요한 데이터만 반환
};

// ✅ React Query 훅 생성
export const useGuideQuery = (categoryId: string) => {
  return useQuery({
    queryKey: ["guide_detail", categoryId],
    queryFn: () => fetchGuide(categoryId),
    enabled: !!categoryId,
    retry: false,
    staleTime: 0, // ✅ 데이터가 즉시 만료됨 (항상 최신 데이터 가져옴)
    cacheTime: 0, // ✅ 캐시된 데이터를 사용하지 않음
    refetchOnMount: true, // ✅ 모달을 다시 열 때마다 데이터 새로고침
  });
};

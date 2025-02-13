import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ✅ 멤버 상세 정보를 가져오는 API 호출 함수
const fetchTemplate = async (categoryId: string) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token is missing. Please log in again.");
  }

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/templates/${categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data; // 필요한 데이터만 반환
};

// ✅ React Query 훅 생성
export const useTemplateQuery = (categoryId: string) => {
  return useQuery({
    queryKey: ["template_detail", categoryId], // 캐싱 키에 categoryId 포함
    queryFn: () => fetchTemplate(categoryId),
    enabled: !!categoryId, // categoryId가 있을 때만 쿼리 실행
    retry: false, // 요청 실패 시 재시도 비활성화 (필요에 따라 조정 가능)
    staleTime:0
  });
};

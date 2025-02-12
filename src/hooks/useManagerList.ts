import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ✅ `page`, `size`를 받아서 API 요청하는 함수
const fetchManagerList = async ({ page, size }: { page: number; size: number }) => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken) throw new Error("인증 토큰이 없습니다.");

  // ✅ URLSearchParams를 사용하여 동적으로 쿼리스트링 생성
  const queryParams = new URLSearchParams({ page: String(page), size: String(size) }).toString();

  console.log(`📌 요청: /api/manager/members/page?${queryParams}`);

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/manager/members/page?${queryParams}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  console.log("✅ 응답 데이터:", response.data);
  return response.data; // ✅ response 전체가 아니라 `data`만 반환
};

// ✅ 페이지네이션이 적용된 `useManagerListQuery` 훅
export const useManagerListQuery = ({ page, size }: { page: number; size: number }) => {
  return useQuery({
    queryKey: ["manager_list", page, size], // ✅ 캐싱을 위해 `page`, `size` 포함
    queryFn: () => fetchManagerList({ page, size }), // ✅ API 호출 시 동적으로 값 전달
    keepPreviousData: true, // ✅ 페이지 변경 시 이전 데이터 유지하여 UX 개선
  });
};

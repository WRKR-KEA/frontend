import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ✅ 동적으로 queryParams를 받아 API 요청
const fetchMemberList = async (queryParams: Record<string, string | number>) => {
  const accessToken = sessionStorage.getItem("accessToken");

  // 📌 URLSearchParams로 쿼리스트링 생성
  const queryString = new URLSearchParams(
    Object.entries(queryParams).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== "") acc[key] = String(value); // 빈 값 제외
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/members?${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log("🌟 멤버리스트",response)
  return response.data.result; // 필요한 데이터만 반환
};

// ✅ 동적으로 쿼리 파라미터를 받을 수 있도록 수정
export const useMemberListQuery = (queryParams: Record<string, string | number>) => {
  return useQuery({
    queryKey: ["member_list", queryParams], // 캐싱 키에 쿼리 정보 포함
    queryFn: () => fetchMemberList(queryParams),
  });
};

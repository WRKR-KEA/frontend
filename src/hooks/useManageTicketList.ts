import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ✅ 매니저 티켓 목록을 가져오는 API 호출 함수
const fetchManagerTickets = async (queryParams: Record<string, string | number> = {}) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token is missing. Please log in again.");
  }

  // ✅ 쿼리 파라미터 처리
  const queryString = new URLSearchParams(queryParams as Record<string, string>).toString();
  const url = `http://172.16.211.53:8080/api/manager/tickets${queryString ? `?${queryString}` : ""}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log("🌟 API 응답 데이터:", response);
  return response.data.result; // 필요한 데이터만 반환
};

// ✅ React Query 훅 생성
export const useManageTicketListQuery = (queryParams?: Record<string, string | number>) => {
  return useQuery({
    queryKey: ["manager_tickets", queryParams], // 캐싱 키에 queryParams 포함
    queryFn: () => fetchManagerTickets(queryParams || {}),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분 캐싱
  });
};
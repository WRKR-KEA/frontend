import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ✅ 유저의 최근 티켓 목록을 가져오는 API 함수
const fetchUserMainTickets = async () => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token is missing. Please log in again.");
  }

  const url = "http://172.16.211.53:8080/api/user/tickets/main";

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log("🌟 API 응답 데이터!:", response);
  return response.data.result.recentTickets;
};

// ✅ React Query 훅 생성
export const useUserMainTicketListQuery = () => {
  return useQuery({
    queryKey: ["user_tickets"],
    queryFn: fetchUserMainTickets,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분 캐싱
  });
};
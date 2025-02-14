import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ✅ User 티켓 목록을 가져오는 API 호출 함수
const fetchUserTickets = async (
  currentPage: number,
  maxTicketsToShow: number,
  selectedStatus: string
) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token is missing. Please log in again.");
  }
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/tickets`;

  const response = await axios.get(url, {
    params: {
      page: currentPage,
      size: maxTicketsToShow,
      status: selectedStatus || "",
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("🌟 API 응답 데이터!:", response);
  return response.data.result; // 반환 데이터만 반환
};

// ✅ React Query 훅 생성
export const useUserTicketListQuery = (
  currentPage: number,
  maxTicketsToShow: number,
  selectedStatus: string
) => {
  return useQuery({
    queryKey: ["user_tickets", currentPage, maxTicketsToShow, selectedStatus], // queryKey
    queryFn: () => fetchUserTickets(currentPage, maxTicketsToShow, selectedStatus), // queryFn
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분 캐싱
  });
};
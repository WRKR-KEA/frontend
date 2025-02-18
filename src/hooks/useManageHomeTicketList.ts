import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ✅ 담당자 메인 페이지 사용자 요청 티켓 조회 API 호출 함수
const fetchManagerRequests = async () => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token is missing. Please log in again.");
  }

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/manager/tickets/main/requests`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log("🌟 요청 티켓 API 응답 데이터:", response);
  return response.data.result; // 요청 티켓 데이터 반환
};

// ✅ 담당자 메인 페이지 고정 티켓 조회 API 호출 함수
const fetchManagerPins = async () => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token is missing. Please log in again.");
  }

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/manager/tickets/main/pins`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log("🌟 고정 티켓 API 응답 데이터:", response);
  return response.data.result; // 고정 티켓 데이터 반환
};

// ✅ React Query 훅 - 사용자 요청 티켓 목록 조회
export const useManagerRequestsQuery = () => {
  return useQuery({
    queryKey: ["manager_requests"],
    queryFn: fetchManagerRequests,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분 캐싱
  });
};

// ✅ React Query 훅 - 고정 티켓 목록 조회
export const useManagerPinsQuery = () => {
  return useQuery({
    queryKey: ["manager_pins"],
    queryFn: fetchManagerPins,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분 캐싱
  });
};
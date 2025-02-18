import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchManagerTickets = async (
  currentPage: number,
  maxTicketsToShow: number,
  sortOrder: string,
  selectedStatus: string,
  searchTerm: string,
  categoryId: string,
) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token is missing. Please log in again.");
  }

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/manager/tickets`;

  // 기본 파라미터
  const params: Record<string, any> = {
    page: currentPage,
    size: maxTicketsToShow,
    sortType: sortOrder,
  };

  if (selectedStatus) {
    params.status = selectedStatus;
  }

  if (searchTerm) {
    params.query = searchTerm;
  }

  if (categoryId) {
    params.categoryId = categoryId;
  }

  const response = await axios.get(url, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json;charset=UTF-8",
    },
  });

  return response.data.result;
};

export const useManageTicketListQuery = (
  currentPage: number,
  maxTicketsToShow: number,
  sortOrder: string,
  selectedStatus: string,
  searchTerm: string,
  categoryId: string,
) => {
  return useQuery({
    queryKey: ["manager_tickets", currentPage, maxTicketsToShow, sortOrder, selectedStatus, searchTerm, categoryId],
    queryFn: () => fetchManagerTickets(currentPage, maxTicketsToShow, sortOrder, selectedStatus, searchTerm, categoryId),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
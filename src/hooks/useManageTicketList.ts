import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchManagerTickets = async (
  currentPage: number,
  maxTicketsToShow: number,
  sortOrder: string,
  selectedStatus: string,
  searchTerm: string
) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token is missing. Please log in again.");
  }

  const url = "http://172.16.211.53:8080/api/manager/tickets";

  const response = await axios.get(url, {
    params: {
      page: currentPage,
      size: maxTicketsToShow,
      sortType: sortOrder,
      status: selectedStatus || "",
      query: searchTerm,
    },
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
  searchTerm: string
) => {
  return useQuery({
    queryKey: ["manager_tickets", currentPage, maxTicketsToShow, sortOrder, selectedStatus, searchTerm],
    queryFn: () => fetchManagerTickets(currentPage, maxTicketsToShow, sortOrder, selectedStatus, searchTerm),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
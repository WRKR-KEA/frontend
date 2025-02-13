import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";

const fetchDepartTicket = async (
  searchTerm: string,
  status: string,
  startDate: string | null,
  endDate: string | null,
  currentPage: number,
  maxTicketsToShow: number
) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token is missing. Please log in again.");
  }

  const url = "http://172.16.211.53:8080/api/manager/tickets/department";

  const response = await axios.get(url, {
    params: {
      searchTerm,
      status,
      startDate,
      endDate,
      page: currentPage,
      size: maxTicketsToShow,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json;charset=UTF-8",
    },
  });

  return response.data.result;
};

export const useDepartTicketListQuery = (
  searchTerm: string,
  status: string,
  dateRange: { startDate: Date | null; endDate: Date | null },
  currentPage: number,
  maxTicketsToShow: number
) => {
  return useQuery({
    queryKey: [
      "manager_department_tickets",
      searchTerm,
      status,
      dateRange.startDate,
      dateRange.endDate,
      currentPage,
      maxTicketsToShow,
    ],
    queryFn: () =>
      fetchDepartTicket(
        searchTerm,
        status,
        dateRange.startDate ? format(dateRange.startDate, "yyyy-MM-dd") : null,
        dateRange.endDate ? format(dateRange.endDate, "yyyy-MM-dd") : null,
        currentPage,
        maxTicketsToShow
      ),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
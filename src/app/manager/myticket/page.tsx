"use client";

import { useState, useEffect } from "react";
import { TicketList_Manager } from "@/components/Tickets/ticketList_Manager";
import { FilterNum } from "@/components/Filters/filterNum";
import { FilterOrder } from "@/components/Filters/filterOrder";
import { Search_manager } from "@/components/search_manager";
import { fetchManagerTicketList } from "@/service/manager"; // Make sure this is correctly imported

export default function ManagerTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });
  const [tickets, setTickets] = useState([]);
  const [sortOrder, setSortOrder] = useState("우선순위 순");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectCount = (count: number) => {
    setMaxTicketsToShow(count);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleSelectOrder = (order: string) => {
    setSortOrder(order);
  };

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchManagerTicketList(
        1, // Page number (you can adjust this for pagination)
        20, // Number of tickets per page
        "createdAt", // Sort by date
        "REQUEST", // Or any other status you want to filter by
        "NEWEST", // Sort type (you can adjust this to "OLDEST" or other types)
        searchTerm // Query for search term
      );
      console.log("data",data?.result?.requestTickets);
      setTickets(data?.result?.requestTickets || []); // Set tickets from the response
    } catch (err) {
      setError("티켓 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(); 
  }, [searchTerm]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex items-center">
        <h2 className="text-md font-semibold">티켓 조회</h2>

        <div className="flex items-center space-x-2 ml-4">
          <Search_manager onSearchChange={handleSearchChange} />
        </div>

        <div className="ml-auto flex items-center ">
          <FilterOrder onSelectOrder={handleSelectOrder} />
          <FilterNum onSelectCount={handleSelectCount} />
        </div>
      </div>

      <TicketList_Manager
        tickets={tickets}
        maxTicketsToShow={maxTicketsToShow}
        searchTerm={searchTerm}
        dateRange={dateRange}
        sortOrder={sortOrder}
      />
    </div>
  );
}
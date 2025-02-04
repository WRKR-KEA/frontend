"use client";

import { useState } from "react";
import { TicketList_User } from "@/components/Tickets/ticketList_User";
import { FilterNum } from "@/components/Filters/filterNum";
import { Search } from "@/components/search";
import { useUserTicketListQuery } from "@/hooks/useUserTicket";

export default function UserTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });

  // ✅ useUserTicketListQuery 훅을 사용하여 API에서 티켓 데이터 가져오기
  const { data: tickets, isLoading, error } = useUserTicketListQuery({});

  console.log(tickets)
  // 에러 처리
  if (error) {
    return <p className="text-red-500">티켓 데이터를 불러오는 중 오류가 발생했습니다.</p>;
  }

  // 로딩 상태 처리
  if (isLoading) {
    return <p className="text-gray-500">로딩 중...</p>;
  }


  const handleSelectCount = (count: number) => {
    setMaxTicketsToShow(count);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex items-center">
        <h2 className="text-md font-semibold">티켓 조회</h2>

        <div className="flex items-center space-x-4 ml-4">
          <Search onSearchChange={handleSearchChange} />
        </div>

        <div className="ml-auto">
          <FilterNum onSelectCount={handleSelectCount} />
        </div>
      </div>

      <TicketList_User
        tickets={tickets}
        maxTicketsToShow={tickets.size}
        searchTerm={searchTerm}
        dateRange={dateRange}
      />
    </div>
  );
}

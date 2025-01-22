"use client";

import { useState } from "react";
import { TicketList_UserManager} from "../../../components/ticketList_UserManager";
import { FilterNum } from "../../../components/filterNum"; 
import PagePagination from "../../../components/pagination"; 
import { Search } from "../../../components/search";

export default function UserTicketListPage() {
  const [maxTicketsToShow, setMaxTicketsToShow] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const [dateRange, setDateRange] = useState<any>({
    startDate: null,
    endDate: null,
    key: "selection",
  });

  const [tickets, setTickets] = useState([
    { "id": "AAA000001", "status": "작업완료", "title": "VM이 안됩니다. 도와주세요!", "requester": "춘식이", "requestDate": "2025.01.01", "updateDate": "2025.01.14", "handler": "라이언" },
    { "id": "AAA000002", "status": "작업진행", "title": "네트워크 장애 해결 요청", "requester": "춘식이", "requestDate": "2025.01.02", "updateDate": "2025.01.15", "handler": "어피치" },
    { "id": "AAA000003", "status": "작업완료", "title": "하드웨어 장애 해결 요청", "requester": "춘식이", "requestDate": "2025.01.03", "updateDate": "2025.01.16", "handler": "네오" },
    { "id": "AAA000004", "status": "작업진행", "title": "권한 요청", "requester": "춘식이", "requestDate": "2025.01.04", "updateDate": "2025.01.17", "handler": "프로도" },
    { "id": "AAA000005", "status": "작업진행", "title": "서버 재부팅 요청", "requester": "춘식이", "requestDate": "2025.01.05", "updateDate": "2025.01.18", "handler": "튜브" },
    { "id": "AAA000006", "status": "작업완료", "title": "VM이 느려요.", "requester": "춘식이", "requestDate": "2025.01.06", "updateDate": "2025.01.19", "handler": "무지" },
    { "id": "AAA000007", "status": "작업진행", "title": "디스크 용량 부족 해결 요청", "requester": "춘식이", "requestDate": "2025.01.07", "updateDate": "2025.01.20", "handler": "제이지" },
    { "id": "AAA000008", "status": "반려", "title": "파일 복구 요청", "requester": "춘식이", "requestDate": "2025.01.08", "updateDate": "2025.01.21", "handler": "라이언" },
    { "id": "AAA000009", "status": "작업완료", "title": "서버 모니터링 요청", "requester": "춘식이", "requestDate": "2025.01.09", "updateDate": "2025.01.22", "handler": "어피치" },
    { "id": "AAA000010", "status": "작업취소", "title": "서비스 장애 복구 요청", "requester": "춘식이", "requestDate": "2025.01.10", "updateDate": "2025.01.23", "handler": "네오" },
    { "id": "AAA000011", "status": "작업완료", "title": "Hadoop 비밀번호 변경 요청", "requester": "춘식이", "requestDate": "2025.01.11", "updateDate": "2025.01.24", "handler": "프로도" },
    { "id": "AAA000012", "status": "작업진행", "title": "파일 접근 권한 요청", "requester": "춘식이", "requestDate": "2025.01.12", "updateDate": "2025.01.25", "handler": "튜브" },
    { "id": "AAA000013", "status": "작업완료", "title": "새 서버 설정 요청", "requester": "춘식이", "requestDate": "2025.01.13", "updateDate": "2025.01.26", "handler": "무지" },
    { "id": "AAA000014", "status": "작업완료", "title": "서버 부팅 불가 문제", "requester": "춘식이", "requestDate": "2025.01.14", "updateDate": "2025.01.27", "handler": "제이지" },
    { "id": "AAA000015", "status": "작업취소", "title": "보안 설정 변경 요청", "requester": "춘식이", "requestDate": "2025.01.15", "updateDate": "2025.01.28", "handler": "라이언" },
    { "id": "AAA000016", "status": "반려", "title": "서비스 성능 최적화 요청", "requester": "춘식이", "requestDate": "2025.01.16", "updateDate": "2025.01.29", "handler": "어피치" },
    { "id": "AAA000017", "status": "작업진행", "title": "백업 복구 요청", "requester": "춘식이", "requestDate": "2025.01.17", "updateDate": "2025.01.30", "handler": "네오" },
    { "id": "AAA000018", "status": "작업완료", "title": "스케줄링 문제 해결 요청", "requester": "춘식이", "requestDate": "2025.01.18", "updateDate": "2025.01.31", "handler": "프로도" },
    { "id": "AAA000019", "status": "작업완료", "title": "네트워크 지연 문제 해결", "requester": "춘식이", "requestDate": "2025.01.19", "updateDate": "2025.02.01", "handler": "튜브" },
    { "id": "AAA000020", "status": "작업취소", "title": "서버 로그 분석 요청", "requester": "춘식이", "requestDate": "2025.01.20", "updateDate": "2025.02.02", "handler": "무지" },
    { "id": "AAA000021", "status": "작업요청", "title": "Hadoop 클러스터 점검", "requester": "춘식이", "requestDate": "2025.01.21", "updateDate": "2025.02.03", "handler": "제이지" },
    { "id": "AAA000022", "status": "작업진행", "title": "소프트웨어 설치 요청", "requester": "춘식이", "requestDate": "2025.01.22", "updateDate": "2025.02.04", "handler": "라이언" },
    { "id": "AAA000023", "status": "작업요청", "title": "하드웨어 교체 요청", "requester": "춘식이", "requestDate": "2025.01.23", "updateDate": "2025.02.05", "handler": "어피치" },
    { "id": "AAA000024", "status": "작업요청", "title": "사용자 계정 복구 요청", "requester": "춘식이", "requestDate": "2025.01.24", "updateDate": "2025.02.06", "handler": "네오" },
    { "id": "AAA000025", "status": "작업취소", "title": "네트워크 설정 변경 요청", "requester": "춘식이", "requestDate": "2025.01.25", "updateDate": "2025.02.07", "handler": "프로도" },
    { "id": "AAA000026", "status": "작업요청", "title": "데이터베이스 최적화", "requester": "춘식이", "requestDate": "2025.01.26", "updateDate": "2025.02.08", "handler": "튜브" },
    { "id": "AAA000027", "status": "반려", "title": "서비스 장애 분석 요청", "requester": "춘식이", "requestDate": "2025.01.27", "updateDate": "2025.02.09", "handler": "무지" },
    { "id": "AAA000028", "status": "작업요청", "title": "서버 스냅샷 요청", "requester": "춘식이", "requestDate": "2025.01.28", "updateDate": "2025.02.10", "handler": "제이지" },
    { "id": "AAA000029", "status": "작업요청", "title": "데이터 손실 문제 해결 요청", "requester": "춘식이", "requestDate": "2025.01.29", "updateDate": "2025.02.11", "handler": "라이언" },
    { "id": "AAA000030", "status": "작업취소", "title": "사용자 권한 수정 요청", "requester": "춘식이", "requestDate": "2025.01.30", "updateDate": "2025.02.12", "handler": "어피치" }
 ]);

  const handleSelectCount = (count: number) => {
    setMaxTicketsToShow(count);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // 페이지 변경 시 스크롤 맨 위로 이동
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  // Filter tickets where requester is "요청자 이름"  
  const filteredTickets = tickets.filter(ticket => ticket.requester === "춘식이");

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex items-center">
        <h2 className="text-md font-semibold">티켓 조회</h2>
        
        {/* 검색 컴포넌트 추가 */}
        <div className="flex items-center space-x-4 ml-4 "> 
          <Search onSearchChange={handleSearchChange} /> 
        </div>

        <div className="ml-auto"> 
          <FilterNum onSelectCount={handleSelectCount} />
        </div>
      </div>
      
      <TicketList_UserManager
        tickets={filteredTickets} 
        maxTicketsToShow={maxTicketsToShow}
        page={currentPage}
        searchTerm={searchTerm}
        dateRange={dateRange}
      />
      
      <div className="flex justify-center items-center mt-4">
        <PagePagination
          totalItemsCount={filteredTickets.length}
          itemsCountPerPage={maxTicketsToShow}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
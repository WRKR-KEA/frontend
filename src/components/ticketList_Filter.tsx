import React, { useState } from 'react';

type TicketList_FilterProps = {
  maxTicketsToShow: number;
  page: number;
  searchTerm: string;
};

export function TicketList_Filter({ maxTicketsToShow, page, searchTerm }: TicketList_FilterProps) {
  const tickets = [
        { "id": "AAA000001", "status": "작업완료", "title": "VM이 안됩니다. 도와주세요!", "requester": "춘식이", "requestDate": "2025.01.01", "updateDate": "2025.01.14", "handler": "라이언" },
        { "id": "AAA000002", "status": "작업진행", "title": "네트워크 장애 해결 요청", "requester": "춘식이", "requestDate": "2025.01.02", "updateDate": "2025.01.15", "handler": "어피치" },
        { "id": "AAA000003", "status": "작업완료", "title": "하드웨어 장애 해결 요청", "requester": "춘식이", "requestDate": "2025.01.03", "updateDate": "2025.01.16", "handler": "네오" },
        { "id": "AAA000004", "status": "작업진행", "title": "권한 요청", "requester": "춘식이", "requestDate": "2025.01.04", "updateDate": "2025.01.17", "handler": "프로도" },
        { "id": "AAA000005", "status": "작업진행", "title": "서버 재부팅 요청", "requester": "춘식이", "requestDate": "2025.01.05", "updateDate": "2025.01.18", "handler": "튜브" },
        { "id": "AAA000006", "status": "작업완료", "title": "VM이 느려요.", "requester": "춘식이", "requestDate": "2025.01.06", "updateDate": "2025.01.19", "handler": "무지" },
        { "id": "AAA000007", "status": "작업진행", "title": "디스크 용량 부족 해결 요청", "requester": "춘식이", "requestDate": "2025.01.07", "updateDate": "2025.01.20", "handler": "제이지" },
        { "id": "AAA000008", "status": "작업진행", "title": "파일 복구 요청", "requester": "춘식이", "requestDate": "2025.01.08", "updateDate": "2025.01.21", "handler": "라이언" },
        { "id": "AAA000009", "status": "작업완료", "title": "서버 모니터링 요청", "requester": "춘식이", "requestDate": "2025.01.09", "updateDate": "2025.01.22", "handler": "어피치" },
        { "id": "AAA000010", "status": "작업취소", "title": "서비스 장애 복구 요청", "requester": "춘식이", "requestDate": "2025.01.10", "updateDate": "2025.01.23", "handler": "네오" },
        { "id": "AAA000011", "status": "작업완료", "title": "Hadoop 비밀번호 변경 요청", "requester": "춘식이", "requestDate": "2025.01.11", "updateDate": "2025.01.24", "handler": "프로도" },
        { "id": "AAA000012", "status": "작업진행", "title": "파일 접근 권한 요청", "requester": "춘식이", "requestDate": "2025.01.12", "updateDate": "2025.01.25", "handler": "튜브" },
        { "id": "AAA000013", "status": "작업완료", "title": "새 서버 설정 요청", "requester": "춘식이", "requestDate": "2025.01.13", "updateDate": "2025.01.26", "handler": "무지" },
        { "id": "AAA000014", "status": "작업완료", "title": "서버 부팅 불가 문제", "requester": "춘식이", "requestDate": "2025.01.14", "updateDate": "2025.01.27", "handler": "제이지" },
        { "id": "AAA000015", "status": "작업취소", "title": "보안 설정 변경 요청", "requester": "춘식이", "requestDate": "2025.01.15", "updateDate": "2025.01.28", "handler": "라이언" },
        { "id": "AAA000016", "status": "작업완료", "title": "서비스 성능 최적화 요청", "requester": "춘식이", "requestDate": "2025.01.16", "updateDate": "2025.01.29", "handler": "어피치" },
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
        { "id": "AAA000027", "status": "작업진행", "title": "서비스 장애 분석 요청", "requester": "춘식이", "requestDate": "2025.01.27", "updateDate": "2025.02.09", "handler": "무지" },
        { "id": "AAA000028", "status": "작업요청", "title": "서버 스냅샷 요청", "requester": "춘식이", "requestDate": "2025.01.28", "updateDate": "2025.02.10", "handler": "제이지" },
        { "id": "AAA000029", "status": "작업요청", "title": "데이터 손실 문제 해결 요청", "requester": "춘식이", "requestDate": "2025.01.29", "updateDate": "2025.02.11", "handler": "라이언" },
        { "id": "AAA000030", "status": "작업취소", "title": "사용자 권한 수정 요청", "requester": "춘식이", "requestDate": "2025.01.30", "updateDate": "2025.02.12", "handler": "어피치" }
       ];

  const statusStyles: Record<string, string> = {
    작업완료: "bg-green-100 text-green-600",
    작업진행: "bg-purple-100 text-purple-600",
    작업취소: "bg-red-100 text-red-600",
    승인: "bg-orange-100 text-orange-600",
    작업요청: "bg-pink-100 text-pink-600",
  };

  const [filterStatus, setFilterStatus] = useState<string>("전체");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleStatusClick = (status: string) => {
    if (filterStatus === status) {
      setFilterStatus("전체");
    } else {
      setFilterStatus(status);
    }
    setIsDropdownOpen(false);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearchTerm = ticket.title.includes(searchTerm) || ticket.handler.includes(searchTerm) || ticket.id.includes(searchTerm);
    const matchesStatus = filterStatus === "전체" || ticket.status === filterStatus;
    return matchesSearchTerm && matchesStatus;
  });

  const displayedTickets = filteredTickets.slice((page - 1) * maxTicketsToShow, page * maxTicketsToShow);

  return (
    <div className="bg-white rounded-md shadow-md">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 w-36">티켓 ID</th>
            <th className="px-4 py-2 w-24 flex items-center cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            상태
            <span className="ml-2 text-sm">
                {isDropdownOpen ? "▲" : "▼"}
                </span>
              {isDropdownOpen && (
                <div className="absolute bg-white border shadow-lg mt-60">
                  {["전체", "작업완료","작업요청", "작업진행", "작업취소"].map((status) => (
                    <div key={status} className="cursor-pointer px-4 py-2 hover:bg-gray-100 font-normal" onClick={() => handleStatusClick(status)}>
                      {status}
                    </div>
                  ))}
                </div>
              )}
            </th>
            <th className="px-4 py-2 w-80">제목</th>
            <th className="px-4 py-2 w-32">담당자</th>
            <th className="px-4 py-2 w-32">요청자</th>
            <th className="px-4 py-2 w-36">요청일</th>
            <th className="px-4 py-2 w-36">마지막 업데이트</th>
          </tr>
        </thead>
        <tbody>
          {displayedTickets.map((ticket) => (
            <tr key={ticket.id} className="border-t">
              <td className="px-4 py-2">{ticket.id}</td>
              <td className="px-4 py-2">
                <span className={`rounded-md px-2 py-1 text-sm ${statusStyles[ticket.status]}`}>
                  {ticket.status}
                </span>
              </td>
              <td className="px-4 py-2">{ticket.title}</td>
              <td className="px-4 py-2">{ticket.handler}</td>
              <td className="px-4 py-2">{ticket.requester}</td>
              <td className="px-4 py-2">{ticket.requestDate}</td>
              <td className="px-4 py-2">{ticket.updateDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
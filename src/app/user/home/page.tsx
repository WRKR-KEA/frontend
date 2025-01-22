"use client";

import React, { useState, useEffect } from "react";
import { TicketInfo } from "../../../components/ticketInfo";
import { TicketStatus } from "../../../components/ticketStatus";
import { TicketList } from "../../../components/ticketList";

export default function UserHomePage() {
  const maxTicketsToShow = 10;
  const [ticketHandler, setTicketHandler] = useState<string>(""); // 필터링 담당자
  const [ticketRequester, setTicketRequester] = useState<string>("춘식이"); // 필터링 요청자

  const tickets = [
    { "id": "AAA000001", "status": "작업완료", "title": "VM이 안됩니다. 도와주세요!", "requester": "춘식이", "requestDate": "2025.01.01", "updateDate": "2025.01.14", "acceptDate": "2025.01.02", "completeDate": "2025.01.13", "handler": "라이언" },
    { "id": "AAA000002", "status": "작업진행", "title": "네트워크 장애 해결 요청", "requester": "춘식삼", "requestDate": "2025.01.02", "updateDate": "2025.01.15", "acceptDate": "2025.01.03", "completeDate": null, "handler": "어피치" },
    { "id": "AAA000003", "status": "작업완료", "title": "하드웨어 장애 해결 요청", "requester": "춘식사", "requestDate": "2025.01.03", "updateDate": "2025.01.16", "acceptDate": "2025.01.04", "completeDate": "2025.01.15", "handler": "네오" },
    { "id": "AAA000004", "status": "작업진행", "title": "권한 요청", "requester": "춘식오", "requestDate": "2025.01.04", "updateDate": "2025.01.17", "acceptDate": "2025.01.05", "completeDate": null, "handler": "프로도" },
    { "id": "AAA000005", "status": "작업진행", "title": "서버 재부팅 요청", "requester": "춘식일", "requestDate": "2025.01.05", "updateDate": "2025.01.18", "acceptDate": "2025.01.06", "completeDate": null, "handler": "튜브" },
    { "id": "AAA000006", "status": "작업완료", "title": "VM이 느려요.", "requester": "오레오", "requestDate": "2025.01.06", "updateDate": "2025.01.19", "acceptDate": "2025.01.07", "completeDate": "2025.01.18", "handler": "무지" },
    { "id": "AAA000007", "status": "작업진행", "title": "디스크 용량 부족 해결 요청", "requester": "춘식이", "requestDate": "2025.01.07", "updateDate": "2025.01.20", "acceptDate": "2025.01.08", "completeDate": null, "handler": "제이지" },
    { "id": "AAA000008", "status": "작업진행", "title": "파일 복구 요청", "requester": "오레오", "requestDate": "2025.01.08", "updateDate": "2025.01.21", "acceptDate": "2025.01.09", "completeDate": null, "handler": "라이언" },
    { "id": "AAA000009", "status": "작업완료", "title": "서버 모니터링 요청", "requester": "네오", "requestDate": "2025.01.09", "updateDate": "2025.01.22", "acceptDate": "2025.01.10", "completeDate": "2025.01.21", "handler": "어피치" },
    { "id": "AAA000010", "status": "반려", "title": "서비스 장애 복구 요청", "requester": "춘식일", "requestDate": "2025.01.10", "updateDate": "2025.01.23", "acceptDate": "2025.01.10", "completeDate": null, "handler": "네오" },
    { "id": "AAA000011", "status": "작업완료", "title": "Hadoop 비밀번호 변경 요청", "requester": "춘식이", "requestDate": "2025.01.11", "updateDate": "2025.01.24", "acceptDate": "2025.01.12", "completeDate": "2025.01.23", "handler": "프로도" },
    { "id": "AAA000012", "status": "작업진행", "title": "파일 접근 권한 요청", "requester": "춘식이", "requestDate": "2025.01.12", "updateDate": "2025.01.25", "acceptDate": "2025.01.13", "completeDate": null, "handler": "튜브" },
    { "id": "AAA000013", "status": "작업취소", "title": "새 서버 설정 요청", "requester": "춘식이", "requestDate": "2025.01.13", "updateDate": "2025.01.26", "acceptDate": "2025.01.14", "completeDate": "2025.01.25", "handler": "무지" },
    { "id": "AAA000014", "status": "작업완료", "title": "서버 부팅 불가 문제", "requester": "춘식이", "requestDate": "2025.01.14", "updateDate": "2025.01.27", "acceptDate": "2025.01.15", "completeDate": "2025.01.26", "handler": "제이지" },
    { "id": "AAA000015", "status": "반려", "title": "보안 설정 변경 요청", "requester": "춘식이", "requestDate": "2025.01.15", "updateDate": "2025.01.28", "acceptDate": "2025.01.17", "completeDate": null, "handler": "라이언" },
    { "id": "AAA000016", "status": "작업완료", "title": "서비스 성능 최적화 요청", "requester": "춘식이", "requestDate": "2025.01.16", "updateDate": "2025.01.29", "acceptDate": "2025.01.17", "completeDate": "2025.01.28", "handler": "어피치" },
    { "id": "AAA000017", "status": "작업진행", "title": "백업 복구 요청", "requester": "춘식이", "requestDate": "2025.01.17", "updateDate": "2025.01.30", "acceptDate": "2025.01.18", "completeDate": null, "handler": "네오" },
    { "id": "AAA000018", "status": "작업완료", "title": "스케줄링 문제 해결 요청", "requester": "춘식이", "requestDate": "2025.01.18", "updateDate": "2025.01.31", "acceptDate": "2025.01.19", "completeDate": "2025.01.30", "handler": "프로도" },
    { "id": "AAA000019", "status": "작업취소", "title": "네트워크 지연 문제 해결", "requester": "춘식이", "requestDate": "2025.01.19", "updateDate": "2025.02.01", "acceptDate": "2025.01.20", "completeDate": "2025.01.31", "handler": "튜브" },
    { "id": "AAA000020", "status": "반려", "title": "서버 로그 분석 요청", "requester": "춘식이", "requestDate": "2025.01.20", "updateDate": "2025.02.02", "acceptDate": "2025.01.21", "completeDate": null, "handler": "무지" },
    { "id": "AAA000021", "status": "작업완료", "title": "Hadoop 클러스터 점검", "requester": "춘식이", "requestDate": "2025.01.21", "updateDate": "2025.02.03", "acceptDate": "2025.01.22", "completeDate": "2025.02.02", "handler": "제이지" },
    { "id": "AAA000022", "status": "작업진행", "title": "소프트웨어 설치 요청", "requester": "춘식이", "requestDate": "2025.01.22", "updateDate": "2025.02.04", "acceptDate": "2025.01.23", "completeDate": null, "handler": "라이언" },
    { "id": "AAA000023", "status": "작업완료", "title": "하드웨어 교체 요청", "requester": "프로도", "requestDate": "2025.01.23", "updateDate": "2025.02.05", "acceptDate": "2025.01.24", "completeDate": "2025.02.04", "handler": "어피치" },
    { "id": "AAA000024", "status": "작업완료", "title": "사용자 계정 복구 요청", "requester": "춘식이", "requestDate": "2025.01.24", "updateDate": "2025.02.06", "acceptDate": "2025.01.25", "completeDate": "2025.02.05", "handler": "네오" },
    { "id": "AAA000025", "status": "반려", "title": "네트워크 설정 변경 요청", "requester": "춘식이", "requestDate": "2025.01.25", "updateDate": "2025.02.07", "acceptDate": "2025.01.31", "completeDate": null, "handler": "프로도" },
    { "id": "AAA000026", "status": "작업완료", "title": "데이터베이스 최적화", "requester": "춘식이", "requestDate": "2025.01.26", "updateDate": "2025.02.08", "acceptDate": "2025.01.27", "completeDate": "2025.02.07", "handler": "튜브" },
    { "id": "AAA000027", "status": "작업진행", "title": "서비스 장애 분석 요청", "requester": "춘식이", "requestDate": "2025.01.27", "updateDate": "2025.02.09", "acceptDate": "2025.01.28", "completeDate": null, "handler": "무지" },
    { "id": "AAA000028", "status": "작업완료", "title": "소프트웨어 업그레이드 요청", "requester": "춘식이", "requestDate": "2025.01.28", "updateDate": "2025.02.10", "acceptDate": "2025.01.29", "completeDate": "2025.02.09", "handler": "제이지" },
    { "id": "AAA000029", "status": "작업완료", "title": "서버 보안 점검", "requester": "춘식이", "requestDate": "2025.01.29", "updateDate": "2025.02.11", "acceptDate": "2025.01.30", "completeDate": "2025.02.10", "handler": "라이언" },
    { "id": "AAA000030", "status": "작업진행", "title": "클러스터 문제 해결 요청", "requester": "춘식이", "requestDate": "2025.01.30", "updateDate": "2025.02.12", "acceptDate": "2025.01.31", "completeDate": null, "handler": "어피치" },
    { "id": "AAA000031", "status": "반려", "title": "보안 패치 요청", "requester": "춘식이", "requestDate": "2025.01.31", "updateDate": "2025.02.13", "acceptDate": "2025.01.31", "completeDate": null, "handler": "네오" },
    { "id": "AAA000032", "status": "작업완료", "title": "데이터 백업 요청", "requester": "춘식이", "requestDate": "2025.02.01", "updateDate": "2025.02.14", "acceptDate": "2025.02.02", "completeDate": "2025.02.13", "handler": "프로도" },
    { "id": "AAA000033", "status": "작업진행", "title": "서버 업그레이드 요청", "requester": "춘식이", "requestDate": "2025.02.02", "updateDate": "2025.02.15", "acceptDate": "2025.02.03", "completeDate": null, "handler": "튜브" },
    { "id": "AAA000034", "status": "작업완료", "title": "소프트웨어 라이센스 갱신", "requester": "춘식이", "requestDate": "2025.02.03", "updateDate": "2025.02.16", "acceptDate": "2025.02.04", "completeDate": "2025.02.15", "handler": "무지" },
    { "id": "AAA000035", "status": "반려", "title": "서비스 이용계약 변경 요청", "requester": "춘식이", "requestDate": "2025.02.04", "updateDate": "2025.02.17", "acceptDate": "2025.01.31", "completeDate": null, "handler": "제이지" },
    { "id": "AAA000036", "status": "작업완료", "title": "서버 로그 분석", "requester": "춘식이", "requestDate": "2025.02.05", "updateDate": "2025.02.18", "acceptDate": "2025.02.06", "completeDate": "2025.02.17", "handler": "라이언" },
    { "id": "AAA000037", "status": "작업진행", "title": "서버 간 네트워크 연결 확인", "requester": "춘식이", "requestDate": "2025.02.06", "updateDate": "2025.02.19", "acceptDate": "2025.02.07", "completeDate": null, "handler": "어피치" },
    { "id": "AAA000038", "status": "작업완료", "title": "파일 접근 속도 개선 요청", "requester": "춘식이", "requestDate": "2025.02.07", "updateDate": "2025.02.20", "acceptDate": "2025.02.08", "completeDate": "2025.02.19", "handler": "네오" },
    { "id": "AAA000039", "status": "작업진행", "title": "디스크 용량 늘리기", "requester": "춘식이", "requestDate": "2025.02.08", "updateDate": "2025.02.21", "acceptDate": "2025.02.09", "completeDate": null, "handler": "프로도" },
    { "id": "AAA000040", "status": "작업완료", "title": "기존 하드웨어 수리 요청", "requester": "춘식이", "requestDate": "2025.02.09", "updateDate": "2025.02.22", "acceptDate": "2025.02.10", "completeDate": "2025.02.21", "handler": "튜브" }
  ];

  // 티켓 상태 변환 맵
  const statusMap: Record<string, string> = {
    작업요청: "new", // '작업요청' -> 'new'
    반려: "rejected", // '반려' -> 'rejected'
    작업진행: "in-progress", // '작업진행' -> 'in-progress'
    작업완료: "completed", // '작업완료' -> 'completed'
    작업취소: "cancelled", // '작업취소' -> 'cancelled'
  };

  const [ticketStatus, setTicketStatus] = useState<string>("");
  const [selectedTicket, setSelectedTicket] = useState<any>(tickets[0]); // 기본 선택된 티켓은 첫 번째 티켓으로 설정

  // 컴포넌트 마운트 시 첫 번째 티켓의 상태 변환 후 상태 설정
  useEffect(() => {
    if (tickets.length > 0) {
      const initialStatus = statusMap[tickets[0].status] || tickets[0].status; // 상태 변환 맵을 사용하여 초기 상태 설정
      setTicketStatus(initialStatus);
      console.log("초기 티켓의 상태:", initialStatus); // 초기 상태 로그 출력
    }
  }, []); // 컴포넌트 마운트 시에만 실행

  const handleTicketClick = (ticket: Ticket) => {
    // 상태 변환 후 setTicketStatus 호출
    const newStatus = statusMap[ticket.status] || ticketStatus; // ticket.status로 기본 상태 설정
    setTicketStatus(newStatus); // 선택한 티켓 상태 업데이트
    setSelectedTicket(ticket); // 선택한 티켓 업데이트
    console.log("클릭한 티켓의 상태:", newStatus); // 변환된 상태를 로그로 확인
  };

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <h2 className="text-md font-semibold">최근 티켓 조회</h2>
      <div className="flex space-x-6">
        {/* TicketInfo에 선택된 티켓 전달 */}
        <TicketInfo ticket={selectedTicket} />
        <TicketStatus status={ticketStatus} /> {/* 선택된 티켓 상태 전달 */}
      </div>
      <h2 className="text-md font-semibold">최근 티켓 현황</h2>
      <TicketList
        tickets={tickets} // 데이터를 넘김
        maxTicketsToShow={maxTicketsToShow}
        page={1}
        status={ticketStatus}
        handler={ticketHandler}
        requester={ticketRequester}
        onTicketClick={handleTicketClick} // 클릭 핸들러 전달
      />
    </div>
  );
}
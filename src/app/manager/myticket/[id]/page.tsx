"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // app 디렉터리에서 적합한 useRouter 가져오기
import { TicketInfo } from "../../../../components/ticketInfo";
import { TicketStatus } from "../../../../components/ticketStatus";
import TicketComment from "../../../../components/ticketComment";
import Button from "../../../../components/Button";
import { TicketCancel } from "../../../../components/ticketCancel";
import TicketChange from "../../../../components/ticketChange";
import { TicketComplete } from "../../../../components/ticketComplete";
import {TicketAbort} from "../../../../components/ticketAbort";
import { ticketDummyData } from "../../../../data/ticketDummyData";

export default function ManagericketDetailPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const [tickets] = useState(ticketDummyData); // 더미 데이터
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null); // 선택된 티켓
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isCompleteTicketOpen, setIsCompleteTicketOpen] = useState(false); // 작업 완료 모달 상태
  const [isAbortTicketOpen, setIsAbortTicketOpen] = useState(false);

  const logs = [
    { log: "담당자가 어피치로 변경되었습니다.", role: "admin" },
    { message: "안녕하세요, 티켓 관련해서 문의 드립니다.", role: "admin" },
    { message: "티켓 세부 사항 설명 드리겠습니다.", role: "admin" },
    { message: "질문을 작성하였습니다.", role: "user" },
    { log: "담당자가 콘으로 변경되었습니다.", role: "admin" },
    { log: "담당자가 라이언으로 변경되었습니다.", role: "admin" },
    { message: "세부 사항을 알려주셔서 감사합니다.", role: "user" },
    { message: "티켓을 처리해 드리겠습니다.", role: "admin" },
    { message: "감사합니다.", role: "admin" },
    { message: "감사합니다.", role: "user" },
  ];

  useEffect(() => {
    const id = window.location.pathname.split("/").pop(); // URL에서 id 추출
    if (id) {
      const ticket = tickets.find((ticket) => ticket.id == id);
      console.log(id, tickets[id-1]);
      setSelectedTicket(tickets[id-1]); // 티켓이 없으면 null 설정
    }
  }, [tickets]);

   // 티켓 상태 변환 맵
  const statusMap: Record<string, string> = {
    작업요청: "new", // '작업요청' -> 'new'
    반려: "rejected", // '반려' -> 'rejected'
    작업진행: "in-progress", // '작업진행' -> 'in-progress'
    작업완료: "completed", // '작업완료' -> 'completed'
    작업취소: "cancelled", // '작업취소' -> 'cancelled'
  };

  const handleCancelTicket = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const confirmCancel = () => {
    console.log("작업이 취소되었습니다."); // 실제 작업 취소 로직 추가
    setIsModalOpen(false); // 모달 닫기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  if (!selectedTicket) {
    return <div>티켓 정보를 불러오는 중입니다...</div>; // 데이터 로딩 처리
  }

  const handleCompleteTicket = () => {
    setIsCompleteTicketOpen(true);}; // 작업 완료 모달 열기
  const handleAbortTicket = () => {
    setIsAbortTicketOpen(true); };
  const closeAbortTicketModal = () => {
    setIsAbortTicketOpen(false); // 작업 반려 모달 닫기
  };

  const closeCompleteTicketModal = () => {
    setIsCompleteTicketOpen(false); // 작업 완료 모달 닫기
  };

  const toggleChangeModal = () => {
    setIsChangeModalOpen((prev) => !prev); // 담당자 변경 모달 열고 닫기
  };
  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold">티켓 상세 정보</h2>
        <div className="flex space-x-2 mt-2">
        <Button label="작업 반려" onClick={handleAbortTicket} color={2} />
        <Button label="담당자 변경" onClick={toggleChangeModal} color={1} />
        <Button label="작업 완료" onClick={handleCompleteTicket} color={3} />
        </div>
      </div>

      <div className="flex space-x-6">
        <TicketInfo ticket={selectedTicket} />
       <TicketStatus status={statusMap[selectedTicket.status] || selectedTicket.status} />
      </div>

      <h2 className="text-md font-semibold mt-4 mb-2">티켓 상세 문의</h2>
      <TicketComment logs={logs} />

      {/* TicketCancel 컴포넌트 */}
      <TicketCancel isOpen={isModalOpen} onClose={closeModal} onConfirm={confirmCancel} />
    </div>
  );
}
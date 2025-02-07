"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // app 디렉터리에서 적합한 useRouter 가져오기
import { TicketInfo } from "@/components/Tickets/ticketInfo";
import { TicketStatus } from "@/components/Tickets/ticketStatus";
import TicketComment from "@/components/Tickets/ticketComment";
import Button from "@/components/Buttons/Button";
import { TicketCancel } from "@/components/Modals/ticketCancel";
import {fetchComments, fetchTicketDetail, updateTicket} from "@/services/user";

export default function UserTicketDetailPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null); // 선택된 티켓
  const [logs, setLogs] = useState([]);

  const statusMapping = {
    REQUEST: "작업요청",
    CANCEL: "작업취소",
    IN_PROGRESS: "작업진행",
    REJECT: "반려",
    COMPLETE: "작업완료"
  };

  // 티켓 상태 변환 맵
  const statusMap: Record<string, string> = {
    작업요청: "new", // '작업요청' -> 'new'
    반려: "rejected", // '반려' -> 'rejected'
    작업진행: "in-progress", // '작업진행' -> 'in-progress'
    작업완료: "completed", // '작업완료' -> 'completed'
    작업취소: "cancelled", // '작업취소' -> 'cancelled'
  };

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();
    if (id) {
      getTicketDetail(id).then(data => {
        console.log('ticket', data);
        setSelectedTicket(data);
      })
    }
  }, []);

  useEffect(() => {
    if (selectedTicket?.status == "작업요청" || selectedTicket?.status == "취소") return;
    getComments(selectedTicket).then(data => {
      console.log('comments:', data)
      setLogs(data)
    })
  }, [selectedTicket])

  const getComments = async (ticket) => {
    try {
      const response = await fetchComments(ticket.id);
      console.log("response:", response)
      return response.result.comments
      .map(comment => {
        if (comment.type === "SYSTEM") {
          return {
            log: comment.content
          }
        } else {
          return {
            message: comment.content,
            role: comment.type
          }
        }
      })
    } catch (err) {
      console.error(err)
      return []
    }
  }

  const getTicketDetail = async (ticketId) => {
    const response = await fetchTicketDetail(ticketId);
    console.log("response:", response);
    const ticket = response.result;
    return {
      id: ticket.id,
      number: ticket.ticketSerialNumber,
      status: statusMapping[ticket.status],
      type: ticket.category,
      title: ticket.title,
      content: ticket.content,
      requester: ticket.userNickname,
      handler: ticket.managerNickname,
      requestDate: ticket.createdAt,
      acceptDate: ticket.startedAt == null ? "―" : ticket.startedAt,
      updateDate: ticket.updatedAt == null ? "―" : ticket.updatedAt,
      completeDate: ticket.completedAt == null ? "―" : ticket.completedAt,
    }
  }

  const handleCancelTicket = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const confirmCancel = async () => {
    const response = await updateTicket(selectedTicket.id);

    if (!response || !response.isSuccess) {
      throw new Error("티켓 취소 요청이 실패했습니다.");
    }

    setSelectedTicket((prevTicket: any) => ({
      ...prevTicket,
      status: "작업취소", // 상태 업데이트
    }));

    console.log("작업이 취소되었습니다."); // 실제 작업 취소 로직 추가
    setIsModalOpen(false); // 모달 닫기

    router.push("/myticket");
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  if (!selectedTicket) {
    return <div>티켓 정보를 불러오는 중입니다...</div>; // 데이터 로딩 처리
  }

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold">티켓 상세 정보</h2>
        <div className="flex space-x-2 mt-2">
          {/* 버튼이 "new" 상태일 때만 보이도록 조건 추가 */}
          {statusMap[selectedTicket.status] === "new" && (
            <Button label="작업 취소" onClick={handleCancelTicket} color={2} />
          )}
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
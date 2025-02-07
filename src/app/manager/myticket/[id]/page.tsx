"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // app 디렉터리에서 적합한 useRouter 가져오기
import { TicketInfo } from "@/components/Tickets/ticketInfo";
import { TicketStatus } from "@/components/Tickets/ticketStatus";
import TicketComment from "@/components/Tickets/ticketComment";
import Button from "@/components/Buttons/Button";
import { TicketCancel } from "@/components/Modals/ticketCancel";
import TicketChange from "@/components/Modals/ticketChange";
import { TicketComplete } from "@/components/Modals/ticketComplete";
import {TicketAbort} from "@/components/Modals/ticketAbort";
import { updateManagerTicketReject, updateManagerTicketComplete, fetchManagerTicket } from "@/services/manager";
import {fetchComments} from "@/services/user";
import AlertModal from "@/components/Modals/AlertModal";
import Modal from "@/components/Modals/Modal";

export default function ManagericketDetailPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null); // 선택된 티켓
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isCompleteTicketOpen, setIsCompleteTicketOpen] = useState(false); // 작업 완료 모달 상태
  const [isAbortTicketOpen, setIsAbortTicketOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText:'',
    onClose: () => {},
  });

  const showModal = (title: string, btnText='닫기') => {
    setModalState({
      isOpen: true,
      title,
      btnText,
      onClose: () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
      },

    });
  };

  const param = useParams();

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
    const response = await fetchManagerTicket(ticketId);
    console.log("response:", response);
    const ticket = response.result;
    return {
      id: ticket.ticketId,
      number: "?????",
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

  const confirmCompleteTicket = async () => {
    if (!param) return;

    try {
      // TODO: 타입 오류 해결
      const result = await updateManagerTicketComplete(param.id);
      console.log("완료 성공:", result);

      closeCompleteTicketModal();
    } catch (error) {
      console.error("티켓 완료 중 오류 발생:", error);

    }
  };

  const confirmAbortTicket = async () => {
    if (!param) return;

    try {
      // TODO: 타입 오류 해결
      const result = await updateManagerTicketReject(param.id);
      console.log("작업 반려 성공:", result);

      closeAbortTicketModal();
    } catch (error) {
      console.error("작업 반려 중 오류 발생:", error);

    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  if (!selectedTicket) {
    return <div>티켓 정보를 불러오는 중입니다...</div>; // 데이터 로딩 처리
  }

  const handleCompleteTicket = () => {
    setIsCompleteTicketOpen(true); // 작업 완료 모달 열기
  }; 

  const handleAbortTicket = () => {
    setIsAbortTicketOpen(true); 
  };

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
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">티켓 상세 정보</h2>
        <div className="flex space-x-2 mt-2">
        {/* 버튼이 "in-progress" 상태일 때만 보이도록 조건 추가 */}
        {statusMap[selectedTicket.status] === "new" && (
          <div className="flex space-x-2">
            <Button label="작업 반려" onClick={handleAbortTicket} color={2} />
            <Button label="담당자 변경" onClick={toggleChangeModal} color={1} />
            <Button label="작업 완료" onClick={handleCompleteTicket} color={3} />
          </div>
        )}
        </div>
      </div>

      <div className="flex space-x-6">
       <TicketInfo ticket={selectedTicket} />
       <TicketStatus status={statusMap[selectedTicket.status] || selectedTicket.status} />
      </div>

      <h2 className="text-lg font-semibold mt-4 mb-2">티켓 상세 문의</h2>
      <TicketComment logs={logs} ticketId={selectedTicket.id} />

       {/* 작업 반려 모달 */}
       {isAbortTicketOpen && (
          <TicketAbort isOpen={isAbortTicketOpen} onClose={closeAbortTicketModal} onConfirm={confirmAbortTicket} />
      )}

      {/* 담당자 변경 모달 */}
      {isChangeModalOpen && selectedTicket && (
      <TicketChange ticketId={selectedTicket.id} />
)}

      {/* 작업 완료 모달 */}
      {isCompleteTicketOpen && (
        <TicketComplete isOpen={isCompleteTicketOpen} onClose={closeCompleteTicketModal} onConfirm={confirmCompleteTicket} />
      )}
        {modalState.isOpen && (
        <Modal onClose={modalState.onClose}>
          <AlertModal
            title={modalState.title}
            onClick={modalState.onClose}
            btnText={modalState.btnText}
          />
        </Modal>
      )}
    </div>
  );
}
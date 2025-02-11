"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TicketInfo } from "@/components/Tickets/ticketInfo";
import { TicketStatus } from "@/components/Tickets/ticketStatus";
import TicketComment from "@/components/Tickets/ticketComment";
import Button from "@/components/Buttons/Button";
import TicketChange from "@/components/Modals/ticketChange";
import { TicketComplete } from "@/components/Modals/ticketComplete";
import {TicketAbort} from "@/components/Modals/ticketAbort";
import { updateManagerTicketReject, updateManagerTicketComplete, fetchManagerTicket } from "@/services/manager";
import { useCommentList } from '@/hooks/useCommentList';
import AlertModal from "@/components/Modals/AlertModal";
import Modal from "@/components/Modals/Modal";
import TicketRequest from "@/components/Tickets/ticketRequest";

export default function ManagericketDetailPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null); 
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isCompleteTicketOpen, setIsCompleteTicketOpen] = useState(false); 
  const [isAbortTicketOpen, setIsAbortTicketOpen] = useState(false);

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
  const [ticketId, setTicketId] = useState('');
  const { data: commentData } = useCommentList({ ticketId });

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
    if (selectedTicket?.status == "REQUEST" || selectedTicket?.status == "CANCEL") return;
  }, [selectedTicket])

  console.log('티켓 ID:', ticketId);
  console.log('댓글 데이터:', commentData);
  const logs =
    commentData?.result?.comments?.map((comment) => {
      if (comment.type === 'SYSTEM') {
        return { log: comment.content };
      }
      return {
        message: comment.content || comment.attachments,
        role: comment.type,
        createdAt: comment.createdAt,
      };
    }) || [];

  useEffect(() => {
    const id = window.location.pathname.split('/').pop();
    if (id) {
      setTicketId(id); // 티켓 ID 설정
      getTicketDetail(id).then((data) => {
        console.log('ticket', data);
        setSelectedTicket(data);
      });
    }
  }, []);

  const getTicketDetail = async (ticketId) => {
    const response = await fetchManagerTicket(ticketId);
    const ticket = response.result;
    console.log('ticke!!!!', ticket);
    return {
      id: ticket.ticketId,
      number: ticket.ticketSerialNumber,
      status: ticket.status,
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
    <div className="pt-2 pl-6 pr-6 pb-4 flex flex-col">
      <div className="flex space-x-6">
        <div className="flex-1 mt-4">
          <TicketRequest ticket={selectedTicket} />
        </div>
        <div className="flex-1">
        <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">티켓 상세 정보</h2>
            {selectedTicket.status === "IN_PROGRESS" && (
              <div className="flex space-x-3 mt-[-12px]">
                <Button label="요청 반려" onClick={handleAbortTicket} color={7} />
                <Button label="담당자 변경" onClick={toggleChangeModal} color={6} />
                <Button label="작업 완료" onClick={handleCompleteTicket} color={1} />
              </div>
            )}
          </div>
        </div>
          <TicketInfo ticket={selectedTicket} />
          <TicketStatus status={selectedTicket.status} />
          <h2 className="text-lg font-semibold mt-4 mb-2">티켓 상세 문의</h2>
          <TicketComment ticketId={selectedTicket.id} logs={logs}/>
        </div>
      </div>

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
'use client';

import { useState, useEffect } from "react";
import {useParams, useRouter} from "next/navigation"; // app 디렉터리에서 적합한 useRouter 가져오기
import { TicketInfo } from "@/components/Tickets/ticketInfo";
import { TicketStatus } from "@/components/Tickets/ticketStatus";
import TicketComment from "@/components/Tickets/ticketComment";
import Button from "@/components/Buttons/Button";
import { TicketAccept } from "@/components/Modals/ticketAccept";
import { updateManagerTicketApprove, fetchManagerTicket } from "@/services/manager";
import { useCommentList } from '@/hooks/useCommentList';
import AlertTicketModal from "@/components/Modals/AlertTicketModal";
import TicketModal from "@/components/Modals/TicketModal";
import TicketRequest from "@/components/Tickets/ticketRequest";
import Skeleton from "@/components/Skeleton";

export default function ManagericketDetailPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null); // 선택된 티켓
  const [ticketId, setTicketId] = useState('');
  const param = useParams();
  const [countdown, setCountdown] = useState(1);
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

  // ticketId가 있을 때만 댓글 조회
  const { data: commentData } = useCommentList({ ticketId });

  console.log('티켓 ID:', ticketId);
  console.log('댓글 데이터:', commentData);
  const logs = commentData?.result?.comments?.map((comment) => {
    if (comment.type === 'SYSTEM') {
      return { log: comment.content };
    }
    return {
      message: comment.content,
      attachment: comment.attachments,
      role: comment.type as "MANAGER" | "USER", 
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

  const getTicketDetail = async (ticketId: string) => {
    const response = await fetchManagerTicket(ticketId);
    const ticket = response.result;
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
      acceptDate: ticket.startedAt == null ? '―' : ticket.startedAt,
      updateDate: ticket.updatedAt == null ? '―' : ticket.updatedAt,
      completeDate: ticket.completedAt == null ? '―' : ticket.completedAt,
    };
  };

  const handleAcceptTicket = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const confirmAccept = async () => {
    try {
      const result = await updateManagerTicketApprove(ticketId);
      console.log("요청 승인 성공:", result);
  
      setIsModalOpen(false); // 🔹 TicketAccept 모달을 먼저 닫음
      showModal("요청이 승인되었습니다."); 
  
      setTimeout(() => {
        router.push(`/manager/myticket/${result.result[0]?.ticketId}`);
      }, 1000);
  
    } catch (error) {
      console.error("작업 승인 중 오류 발생:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  if (!selectedTicket) {
    return (
      <div className="pt-2 pl-6 pr-6 pb-4 flex flex-col">
        <Skeleton width="100%" height="680px" />
      </div>
      );
  }

  return (
    <div className="pt-2 pl-6 pr-6 pb-4 flex flex-col">
    <div className="flex space-x-6">
      <div className="flex-1 mt-4">
        <TicketRequest ticket={selectedTicket} />
      </div>
      <div className="flex-1">
      <div className="pt-4 px-0 pb-4 flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">티켓 상세 정보</h2>
          <div>
          {selectedTicket.status === "REQUEST" && (
          <Button label="요청 승인" onClick={handleAcceptTicket} color={1} />
          )}  
          </div>
        </div>
      </div>
        <TicketInfo ticket={selectedTicket} />
        <TicketStatus status={selectedTicket.status} />
        <h2 className="text-lg font-semibold mt-4 mb-2">티켓 상세 문의</h2>
        <TicketComment ticketId={selectedTicket.id} logs={logs} status={selectedTicket.status} handler={selectedTicket.handler}/>
      </div>
    </div>
    
      {!modalState.isOpen && ( // 🔹 TicketModal이 열릴 때 TicketAccept 숨김
        <TicketAccept isOpen={isModalOpen} onClose={closeModal} onConfirm={confirmAccept} />
      )}

      {modalState.isOpen && (
        <TicketModal onClose={modalState.onClose}>
          <AlertTicketModal 
            title={modalState.title} 
            onClick={modalState.onClose} 
            btnText={modalState.btnText}
          />
        </TicketModal>
      )}
    </div>
  );
}
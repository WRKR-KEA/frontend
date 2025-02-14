"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { TicketInfo } from "@/components/Tickets/ticketInfo";
import TicketRequest from "@/components/Tickets/ticketRequest";
import { TicketStatus } from "@/components/Tickets/ticketStatus";
import TicketComment from "@/components/Tickets/ticketComment";
import Button from "@/components/Buttons/Button";
import { TicketCancel } from "@/components/Modals/ticketCancel";
import { fetchComments, fetchTicketDetail, updateTicket } from "@/services/user";
import AlertModal from "@/components/Modals/AlertModal";
import Modal from "@/components/Modals/Modal";
import Skeleton from "@/components/Skeleton";

export default function UserTicketDetailPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null); 
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();
    if (id) {
      getTicketDetail(id).then(data => {
        console.log('🌟 티켓 데이터', data);
        setSelectedTicket(data);
        setIsLoading(false); // Stop loading after fetching ticket
      });
    }
  }, []);

  useEffect(() => {
    if (selectedTicket?.status == "REQUEST" || selectedTicket?.status == "CANCEL") return;
    getComments(selectedTicket).then(data => {
      console.log('🌟 코멘트 데이터:', data);
      setLogs(data);
    });
  }, [selectedTicket]);

  const getComments = async (ticket) => {
    try {
      const response = await fetchComments(ticket?.id);
      console.log("🌟 코멘트 응답 데이터:", response, ticket?.id);
      return response?.result.comments.map(comment => {
        if (comment.type === "SYSTEM") {
          return { log: comment.content };
        } else {
          return { message: comment.content, role: comment.type };
        }
      });
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const getTicketDetail = async (ticketId) => {
    const response = await fetchTicketDetail(ticketId);
    const ticket = response.result;
    return {
      id: ticket.id,
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
    };
  };

  const handleCancelTicket = () => {
    setIsModalOpen(true); 
  };

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText: '',
    onClose: () => {},
  });

  const showModal = (title: string, btnText = '닫기') => {
    setModalState({
      isOpen: true,
      title,
      btnText,
      onClose: () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const [countdown, setCountdown] = useState(1);

  const confirmCancel = async () => {
    const response = await updateTicket(selectedTicket.id);
  
    if (!response || !response.isSuccess) {
      throw new Error("티켓 취소 요청이 실패했습니다.");
    }
  
    setSelectedTicket((prevTicket: any) => ({
      ...prevTicket,
      status: "CANCEL",
    }));
  
    console.log("요청이 취소되었습니다.");
    showModal("요청이 취소되었습니다.");
  
    const timer = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
  
    setTimeout(() => {
      clearInterval(timer);
      router.push("/user/myticket"); 
      window.location.reload(); 
    }, 1000);
  
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false); 
  };

  if (isLoading) {
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
          <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">티켓 상세 정보</h2>
              <div className="mt-[-12px]">
                {selectedTicket.status === "REQUEST" && (
                  <Button label="요청 취소" onClick={handleCancelTicket} color={6} />
                )}
              </div>
            </div>
          </div>
          <TicketInfo ticket={selectedTicket} />
          <TicketStatus status={selectedTicket.status || selectedTicket.status} />
          <h2 className="text-lg font-semibold mt-4 mb-2">티켓 상세 문의</h2>
          <TicketComment ticketId={selectedTicket.id} logs={logs} />
        </div>
      </div>

      <TicketCancel isOpen={isModalOpen} onClose={closeModal} onConfirm={confirmCancel} />
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
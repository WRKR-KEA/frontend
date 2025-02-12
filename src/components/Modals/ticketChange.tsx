import React, { useState, useEffect } from "react";
import ChangeMemberList from "@/components/changeMemberList";
import Button from "@/components/Buttons/Button";
import axios from "axios";
import AlertModal from "./AlertModal";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import api from "@/lib/api/axios";

// 티켓 담당자 변경 API 요청 함수
const changeTicketManager = async (ticketId: string, delegateManagerId: string) => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken) throw new Error("인증 토큰이 없습니다.");


  const response = await api.patch(
    `/api/manager/tickets/${ticketId}/delegate`,
    {
      delegateManagerId, // 변경할 담당자 ID
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.data.isSuccess) {
    console.log("담당자 변경이 완료 되었습니다. ", response.data);
    return response.data; // 성공적으로 변경되면 데이터 반환
  } else {
    throw new Error("담당자 변경에 실패했습니다.");
  }
};

export default function TicketChangeModal({ ticketId }: { ticketId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null); // 선택된 담당자 ID
  const [countdown, setCountdown] = useState(1);
  const router = useRouter();
  
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

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const handleChange = async () => {
    if (!selectedManagerId) {
      showModal("담당자를 선택해주세요.");
      return;
    }

    try {
      await changeTicketManager(ticketId, selectedManagerId);
      showModal("담당자 변경이 완료되었습니다."); 

      const timer = setInterval(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      
      setTimeout(() => {
        clearInterval(timer);
        router.push("/user/home");
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    }
  };
  //
  // // 로딩 중일 때 표시
  // if (isLoading) return <div>로딩 중...</div>;
  //
  // // 에러 발생 시 표시
  // if (error) return <div>오류 발생: {error}</div>;

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-[500px] w-full">
          {/* 데이터를 표시할 리스트 컴포넌트 */}
          <div className="max-h-[500px] overflow-y-auto">
            <ChangeMemberList
              onSelectManager={(managerId: string) => setSelectedManagerId(managerId)} // 담당자 선택 시 처리
            />
          </div>

          {/* 버튼 영역 */}
          <div className="mt-4 flex justify-center space-x-3">
            <Button label="취소" onClick={closeModal} color={4} />
            <Button label="변경하기" onClick={handleChange} color={1} />
          </div>
        </div>
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
    )
  );
}
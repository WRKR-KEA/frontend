import React, { useState, useEffect } from "react";
import ChangeMemberList from "@/components/changeMemberList";
import Button from "@/components/Buttons/Button";
import axios from "axios";

// 담당자 정보를 가져오는 API 요청 함수
const fetchManagers = async () => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken) throw new Error("인증 토큰이 없습니다.");

  const response = await axios.get("http://172.16.211.53:8080/api/manager/members", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.data.isSuccess) {
    return response.data.result.managers; // API 응답에서 담당자 리스트를 반환
  } else {
    throw new Error("담당자 데이터를 가져오는 데 실패했습니다.");
  }
};

// 티켓 담당자 변경 API 요청 함수
const changeTicketManager = async (ticketId: string, delegateManagerId: string) => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken) throw new Error("인증 토큰이 없습니다.");

  const response = await axios.patch(
    `http://172.16.211.53:8080/api/manager/tickets/${ticketId}/delegate`,
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
    return response.data; // 성공적으로 변경되면 데이터 반환
  } else {
    throw new Error("담당자 변경에 실패했습니다.");
  }
};

export default function TicketChangeModal({ ticketId }: { ticketId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [managers, setManagers] = useState<any[]>([]); // 담당자 데이터 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null); // 선택된 담당자 ID

  useEffect(() => {
    // 컴포넌트가 마운트되면 API를 호출하여 데이터 가져오기
    const loadManagers = async () => {
      try {
        const data = await fetchManagers();
        setManagers(data); // 데이터를 상태에 저장
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    };

    loadManagers();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const handleChange = async () => {
    if (!selectedManagerId) {
      alert("담당자를 선택해주세요.");
      return;
    }

    try {
      await changeTicketManager(ticketId, selectedManagerId);
      alert("변경되었습니다!"); // 변경 동작을 구현
      closeModal();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 로딩 중일 때 표시
  if (isLoading) return <div>로딩 중...</div>;

  // 에러 발생 시 표시
  if (error) return <div>오류 발생: {error}</div>;

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-[500px] w-full">
          {/* 데이터를 표시할 리스트 컴포넌트 */}
          <div className="max-h-[500px] overflow-y-auto">
            <ChangeMemberList
              data={managers}
              onSelectManager={(managerId: string) => setSelectedManagerId(managerId)} // 담당자 선택 시 처리
            />
          </div>

          {/* 버튼 영역 */}
          <div className="mt-4 flex justify-center space-x-3">
            <Button label="취소" onClick={closeModal} color={4} />
            <Button label="변경하기" onClick={handleChange} color={1} />
          </div>
        </div>
      </div>
    )
  );
}
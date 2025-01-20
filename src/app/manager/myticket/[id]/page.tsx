"use client";

import React, { useState } from "react";
import { TicketInfo } from "../../../../components/ticketInfo";
import { TicketStatus } from "../../../../components/ticketStatus";
import TicketComment from "../../../../components/ticketComment";
import Button from "../../../../components/Button";
import TicketChange from "../../../../components/ticketChange";
import Modal from "../../../../components/Modal";

export default function UserTicketDetailPage() {
  const ticketStatus = "rejected"; // 예시
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelDropdownOpen, setIsCancelDropdownOpen] = useState(false);

  const logs = [
    { log: "담당자가 어피치로 변경되었습니다.", role: "admin" },
    { message: "안녕하세요, 티켓 관련해서 문의 드립니다.", role: "admin" },
    { message: "안녕하세요. 티켓 세부 사항 설명 드리겠습니다.", role: "admin" },
    { message: "질문을 작성하였습니다.", role: "user" },
    { message: "세부 사항을 알려주셔서 감사합니다.", role: "user" },
    { message: "티켓을 처리해 드리겠습니다.", role: "admin" },
    { message: "감사합니다.", role: "admin" },
  ];

  const handleCancelTicket = () => {
    setIsCancelDropdownOpen((prev) => !prev); // 드롭다운 토글
  };

  const confirmCancelTicket = () => {
    console.log("작업 취소 확인");
    setIsCancelDropdownOpen(false); // 드롭다운 닫기
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold">티켓 상세 정보</h2>
        <div className="flex space-x-2 mt-2">
          <Button label="작업 취소" onClick={handleCancelTicket} color={2} />
          <Button label="담당자 변경" onClick={toggleModal} color={1} />
        </div>
      </div>

      <div className="flex space-x-6">
        <TicketInfo />
        <TicketStatus status={ticketStatus} />
      </div>

      <h2 className="text-md font-semibold mt-4 mb-2">티켓 상세 문의</h2>
      <TicketComment logs={logs} />

      {/* 작업 취소 드롭다운 */}
      {isCancelDropdownOpen && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md flex flex-col items-center">
          <p className="text-sm text-red-600 text-center">
            작업을 취소하시겠습니까?<br />
            취소 후 복구할 수 없어요.
          </p>
          <div className="mt-4 flex space-x-4">
            <Button label="취소" onClick={handleCancelTicket} color={2} />
            <Button label="작업 취소" onClick={confirmCancelTicket} color={1} />
          </div>
        </div>
      )}

      {/* 모달 */}
      {isModalOpen && (
        <Modal onClose={toggleModal}>
          <TicketChange />
        </Modal>
      )}
    </div>
  );
}
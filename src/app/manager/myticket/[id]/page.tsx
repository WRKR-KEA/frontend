"use client";

import React, { useState } from 'react';
import { TicketInfo } from "../../../../components/ticketInfo";
import { TicketStatus } from "../../../../components/ticketStatus";
import TicketComment from "../../../../components/ticketComment";
import Button from "../../../../components/Button"; // Button 컴포넌트 임포트

export default function UserTicketDetailPage() {
  const maxTicketsToShow = 10; // 최대 표시할 티켓 수
  const ticketStatus = "rejected"; // 예시 상태, 필요에 따라 이 값을 동적으로 설정

  const [handler, setHandler] = useState<string>('어피치'); // 담당자 상태 관리

  const logs = [
    { log: "담당자가 어피치로 변경되었습니다.", role: "admin" },
    { message: "안녕하세요, 티켓 관련해서 문의 드립니다.", role: "admin" },
    { message: "안녕하세요. 티켓 세부 사항 설명 드리겠습니다.", role: "admin" },
    { message: "질문을 작성하였습니다.", role: "user" },
    { message: "세부 사항을 알려주셔서 감사합니다.", role: "user" },
    { message: "티켓을 처리해 드리겠습니다.", role: "admin" },
    { message: "감사합니다.", role: "admin" },
    { log: "담당자가 어피치로 변경되었습니다.", role: "admin" },
    { log: "담당자가 어피치로 변경되었습니다.", role: "admin" },
    { message: "감사합니다.", role: "admin" },
    { message: "감사합니다.", role: "admin" },
    { message: "감사합니다.", role: "admin" },
    { log: "담당자가 어피치로 변경되었습니다.", role: "admin" },
    { message: "네, 감사합니다.", role: "user" },
    { message: "네, 감사합니다.", role: "user" },
    { message: "네, 감사합니다.", role: "user" },
  ];

  const handleChangeHandler = () => {
    // 담당자 변경 로직 (예시로 임의 담당자로 변경)
    setHandler(handler === '어피치' ? '라이언' : '어피치');
  };

  const handleCompleteTicket = () => {
    // 작업 완료 처리 로직
    console.log("작업완료 처리");
  };

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <div className="flex justify-between items-center"> {/* 제목과 버튼을 같은 줄로 배치 */}
        <h2 className="text-md font-semibold">티켓 상세 정보</h2>
        <div className="flex space-x-2 mt-2"> {/* 버튼을 오른쪽 끝에 배치 */}
          <Button label="담당자 변경" onClick={handleChangeHandler} color={1} /> 
          <Button label="작업완료" onClick={handleCompleteTicket} color={3} /> 
        </div>
      </div>

      <div className="flex space-x-6">
        <TicketInfo />
        <TicketStatus status={ticketStatus} />
      </div>

      <h2 className="text-md font-semibold">티켓 상세 문의</h2>
      <TicketComment logs={logs} /> {/* 코멘트 컴포넌트 추가 */}
    </div>
  );
}
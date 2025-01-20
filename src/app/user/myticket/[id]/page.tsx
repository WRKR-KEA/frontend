"use client";

import { TicketInfo } from "../../../../components/ticketInfo";
import { TicketStatus } from "../../../../components/ticketStatus";
import TicketComment from "../../../../components/ticketComment";
import Button from "../../../../components/Button"; 

export default function UserTicketDetailPage() {
  const ticketStatus = "rejected"; // 예시 상태, 필요에 따라 이 값을 동적으로 설정

  const logs = [
    { log: "담당자가 어피치로 변경되었습니다.", role: "admin" },
    { message: "안녕하세요, 티켓 관련해서 문의 드립니다.안녕하세요, 티켓 관련해서 문의 드립니다.안녕하세요, 티켓 관련해서 문의 드립니다.안녕하세요, 티켓 관련해서 문의 드립니다.", role: "admin" },
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

    const handleCancelTicket = () => {
      console.log("작업취소 처리");
    };

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
    <div className="flex justify-between items-center"> {/* 제목과 버튼을 같은 줄로 배치 */}
      <h2 className="text-md font-semibold">티켓 상세 정보</h2>
      <div className="flex space-x-2 mt-2"> {/* 버튼을 오른쪽 끝에 배치 */}
        <Button label="작업 취소" onClick={handleCancelTicket} color={2} /> 
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
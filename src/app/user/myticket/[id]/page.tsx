import { TicketInfo } from "../../../../components/ticketInfo";
import { TicketStatus } from "../../../../components/ticketStatus";
import TicketComment from "../../../../components/ticketComment";

export default function UserTicketDetailPage() {
  const maxTicketsToShow = 10; // 최대 표시할 티켓 수
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

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <h2 className="text-md font-semibold">티켓 상세 정보</h2>
      <div className="flex space-x-6">
        <TicketInfo />
        <TicketStatus status={ticketStatus} /> {/* 상태를 props로 전달 */}
      </div>
      <h2 className="text-md font-semibold">티켓 상세 문의</h2>
      <TicketComment logs={logs} /> {/* 코멘트 컴포넌트 추가 */}
    </div>
  );
}
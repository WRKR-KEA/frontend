interface Ticket {
  id: string;
  status: string;
  title: string;
  requester: string;
  requestDate: string;
  acceptData: string;
  updateDate: string;
  completeData: string;
  handler: string;
}

export function TicketInfo({ ticket }: { ticket: Ticket }) {
  return (
    <div className="bg-white pl-4 pt-4 pb-4 rounded-md shadow-md flex-1 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">{ticket.id} 티켓 상세 정보</h2>
      <div className="grid grid-cols-2 gap-x-8">
        {/* 첫 번째 열 */}
        <div className="space-y-4 text-left">
          <div>타입: {ticket.title}</div>
          <div>처리자: {ticket.handler}</div>
          <div>요청자: {ticket.requester}</div>
        </div>

        {/* 두 번째 열 */}
        <div className="space-y-4 text-left">
          <div>생성 일시: {ticket.requestDate}</div>
          <div>승인 일시: {ticket.acceptDate}</div>
          <div>수정 일시: {ticket.updateDate}</div>
          <div>완료 일시: {ticket.completeDate}</div>
        </div>
      </div>
    </div>
  );
}
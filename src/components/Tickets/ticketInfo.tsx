import React from "react";

interface TicketInfoProps {
  ticket: {
    id: string,
    number: string,
    firstCatetory: string,
    secondCatetory: string,
    status: string,
    title: string,
    handler: string | "-",
    requester: string | "-"
    requestDate: string,
    updateDate: string | "-",
    acceptDate: string | "-",
    completeDate: string | "-",
  }
}

export const TicketInfo: React.FC<TicketInfoProps> = ({ ticket }) => {
  if (!ticket) {
    console.log("🌟 티켓: ",ticket);
    return <div>Loading...</div>;
  }

  return (
      <div className="bg-component p-4 rounded-md flex-1 max-w-4xl mx-auto min-w-96 mb-2">
        <h2 className="text-md font-semibold mb-4">{ticket.number} 티켓 상세 정보</h2>
        <div className="flex justify-between">
          <div className="space-y-4 text-left truncate w-full">
            {/*TODO: type으로 변경*/}
            <div className="space-y-4 flex flex-col w-full">
              <div className="flex text-sm truncate"><p className="w-16">업무: </p>{ticket.title}</div>
              <div className="flex text-sm truncate"><p className="w-16">담당자: </p>{ticket.handler || '―'}</div>
              <div className="flex text-sm truncate"><p className="w-16">요청자: </p>{ticket.requester || '―'}</div>
              <div className="flex text-sm truncate"><p className="w-16">카테고리: </p>{`${ticket.firstCatetory}/${ticket.secondCatetory}` || '―'}</div>
            </div>
          </div>
          {/* 😎 최근 티켓정보 > 티켓 상세 정보에서 요청일시 승인일시 수정일시 완료일시 좀 더 안쪽으로 이동되었으면 좋겠습니다. => pr 수치 조정 */}
          <div className="w-full space-y-4 text-left whitespace-nowrap">
            <div className="text-sm flex"><p className="w-16">요청 일시: </p> {ticket.requestDate}</div>
            <div className="text-sm flex"><p className="w-16">승인 일시: </p>{ticket.acceptDate}</div>
            <div className="text-sm flex"><p className="w-16">수정 일시: </p>{ticket.updateDate}</div>
            <div className="text-sm flex"><p className="w-16">완료 일시: </p>{ticket.completeDate}</div>
          </div>
        </div>
      </div>
  );
};
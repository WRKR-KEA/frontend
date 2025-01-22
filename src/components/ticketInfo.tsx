export function TicketInfo() {
  return (
    <div className="bg-white pl-4 pt-4 pb-4 rounded-md shadow-md flex-1 max-w-4xl mx-auto"> {/* max-w-lg에서 max-w-4xl로 변경하여 더 넓게 설정 */}
      <h2 className="text-lg font-semibold mb-4">AAA000001 티켓 상세 정보</h2>
      <div className="grid grid-cols-2 gap-x-8">
        {/* 첫 번째 열 */}
        <div className="space-y-4 text-left">
        <div>타입: Hadoop 사용자 비밀번호 변경</div>
        <div>처리자: 어피치</div>
        <div>요청자: 춘식이</div>
      </div>

        {/* 두 번째 열 */}
        <div className="space-y-4 text-left">
          <div>생성 일시: 2025-01-04 11:00</div>
          <div>승인 일시: 2025-01-04 13:00</div>
          <div>수정 일시: 2025-01-04 13:00</div>
          <div>완료 일시: 2025-01-04 13:00</div>
        </div>
      </div>
    </div>
  );
}
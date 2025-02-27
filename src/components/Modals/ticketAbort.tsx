import Button from "@/components/Buttons/Button";

type TicketAbortProps = {
  isOpen: boolean; // isOpen은 boolean 타입
  onClose: () => void; // onClose는 void를 반환하는 함수
  onConfirm: () => void; // onConfirm도 void를 반환하는 함수
};

export function TicketAbort({ isOpen, onClose, onConfirm }: TicketAbortProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg text-center shadow-lg">
        <p className="text-black text-lg font-medium">티켓 작업을 반려하시겠습니까?</p>
        <p className="text-red-500 text-sm mb-6">반려 후 복구할 수 없어요.</p>
        <div className="flex justify-center space-x-4">
          <Button label="취소" onClick={onClose} color={4} />
          <Button label="반려하기" onClick={onConfirm} color={2} />
        </div>
      </div>
    </div>
  );
}
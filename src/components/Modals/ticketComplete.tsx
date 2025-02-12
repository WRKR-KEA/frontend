import Button from "@/components/Buttons/Button";

type TicketCompleteProps = {
  isOpen: boolean; // isOpen은 boolean 타입
  onClose: () => void; // onClose는 void를 반환하는 함수
  onConfirm: () => void; // onConfirm도 void를 반환하는 함수
};

export function TicketComplete({ isOpen, onClose, onConfirm }: TicketCompleteProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg text-center shadow-lg">
        <p className="text-black text-lg font-medium mb-6">티켓 작업을 완료하시겠습니까?</p>
        <div className="flex justify-center space-x-4">
          <Button label="취소" onClick={onClose} color={4} />
          <Button label="완료하기" onClick={onConfirm} color={1} />
        </div>
      </div>
    </div>
  );
}
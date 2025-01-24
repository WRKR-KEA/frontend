import Button from "@/components/Buttons/Button";

type TicketCancelProps = {
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
};

export function TicketCancel({ isOpen, onClose, onConfirm }: TicketCancelProps) {
  if (!isOpen) return null; // isOpen이 false일 때 아무것도 렌더링하지 않음

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg text-center shadow-lg">
        <p className="text-black text-lg font-medium">티켓 작업을 취소하시겠습니까?</p>
        <p className="text-red-500 text-sm mb-6">취소 후 복구할 수 없어요.</p>
        <div className="flex justify-center space-x-4">
          <Button label="취소" onClick={onClose} color={4} />
          <Button label="작업 취소" onClick={onConfirm} color={2} />
        </div>
      </div>
    </div>
  );
}
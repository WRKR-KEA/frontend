import Button from "@/components/Buttons/Button";

type TicketAcceptProps = {
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
};

export function TicketAccept({ isOpen, onClose, onConfirm }: TicketAcceptProps) {
  if (!isOpen) return null; // isOpen이 false일 때 아무것도 렌더링하지 않음

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg text-center shadow-lg">
        <p className="text-black text-lg font-medium mb-6">티켓을 승인하시겠습니까?</p>
        <div className="flex justify-center space-x-4">
          <Button label="취소" onClick={onClose} color={4} />
          <Button label="작업 승인" onClick={onConfirm} color={1} />
        </div>
      </div>
    </div>
  );
}
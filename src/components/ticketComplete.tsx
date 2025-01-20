"use client";

import Button from "./Button";

export function TicketComplete({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg text-center shadow-lg">
        <p className="text-black text-lg font-medium mb-8">티켓 작업을 완료하시겠습니까?</p>
        {/* <p className="text-red-500 text-sm mb-8">완료 후 복구할 수 없어요.</p> */}
        <div className="flex justify-center space-x-4">
          <Button label="취소" onClick={onClose} color={4} />
          <Button label="완료하기" onClick={onConfirm} color={3} />
        </div>
      </div>
    </div>
  );
}
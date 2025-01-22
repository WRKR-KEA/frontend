"use client";

import { useState } from "react";
import Button from "./Button";

export function TicketAbort({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  const [content, setContent] = useState<string>("");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg text-center shadow-lg">
        <p className="text-black text-lg font-medium">티켓 작업을 반려하시겠습니까?</p>
        <p className="text-red-500 text-sm mb-8">반려 후 복구할 수 없어요.</p>
        {/* <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-sm font-medium mb-1 ml-1 text-left" 
          >
            반려사유
          </label>
          <textarea
            id="content"
            className="w-full border border-gray-300 rounded-md p-2"
            style={{ height: "360px" }}
            placeholder="반려사유를 입력해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div> */}
        <div className="flex justify-center space-x-4">
          <Button label="취소" onClick={onClose} color={4} />
          <Button label="반려하기" onClick={() => onConfirm(content)} color={2} />
        </div>
      </div>
    </div>
  );
}
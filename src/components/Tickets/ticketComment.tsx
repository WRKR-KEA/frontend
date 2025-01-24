"use client";

import React, { useState, ChangeEvent } from "react";
import { FiPaperclip, FiSend } from "react-icons/fi"; // 아이콘 가져오기

interface Log {
  log?: string;
  message?: string;
  role?: "admin" | "user"; // 역할은 admin 또는 user로 한정
}

interface TicketCommentProps {
  logs: Log[]; // logs는 Log 배열 타입
}

const TicketComment: React.FC<TicketCommentProps> = ({ logs }) => {
  const [message, setMessage] = useState<string>(""); // 메시지 상태 관리
  const [file, setFile] = useState<File | null>(null); // 파일 상태 관리

  // 파일 첨부 핸들러
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // 첫 번째 파일만 처리
    if (file) {
      setFile(file);
    }
  };

  // 메시지 전송 핸들러
  const handleSendMessage = () => {
    if (message.trim() || file) {
      console.log("Message Sent:", message);
      console.log("File Sent:", file);

      setMessage("");
      setFile(null);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-md p-4 flex flex-col h-[460px]">
      {/* 메시지 목록 부분 */}
      <div className="overflow-y-auto pr-2 flex-1">
        {logs.map((log, index) => (
          <div key={index} className="flex flex-col mb-2">
            {log.log && (
              <div className="flex items-center justify-center mb-1">
                <hr className="flex-grow border-gray-300" />
                <span className="text-xs text-gray-500 px-2 bg-gray-50">
                  {log.log}
                </span>
                <hr className="flex-grow border-gray-300" />
              </div>
            )}
            {log.message && (
              <div
                className={`flex ${log.role === "admin" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[1100px] p-2 rounded-lg ${
                    log.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {log.message}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 메시지 작성란 */}
      <div className="flex space-x-4 items-center mt-2">
        {/* 파일 첨부 버튼 */}
        <label htmlFor="file-upload" className="cursor-pointer">
          <button className="bg-gray-200 rounded-lg p-2 hover:bg-gray-300 hover:rounded-xl">
            <FiPaperclip className="text-xl text-gray-600" />
          </button>
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* 메시지 입력란 */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 p-2 rounded-lg border border-gray-300"
        />

        {/* 전송 버튼 */}
        <button
          onClick={handleSendMessage}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <FiSend className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default TicketComment;
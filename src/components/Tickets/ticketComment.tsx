import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { FiPaperclip, FiSend } from 'react-icons/fi';
import useUserStore from '@/stores/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { postComment } from '@/services/user';
import { formatTime } from '@/app/utils/formatTime'

interface Log {
  log?: string;
  message?: string;
  role?: 'MANAGER' | 'USER';
  createdAt?: string;
}

export interface TicketCommentProps {
  logs: Log[];
  ticketId: string;
}

const TicketComment: React.FC<TicketCommentProps> = ({ logs, ticketId }) => {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 같은 댓글 여러번 제출 방지
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 채팅 내용이 변경될 때마다 스크롤을 최하단으로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const displayLogs =
    logs.length === 0 ? [{ log: '소통 내역이 없습니다.' }] : logs;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !file) return;
    if (isLoading) return; // 이미 전송 중이면 return

    try {
      setIsLoading(true);

      // 텍스트 메시지 전송
      if (message.trim()) {
        await postComment(ticketId, message);
      }

      // 성공 시 쿼리 무효화
      queryClient.refetchQueries({
        queryKey: ['comments', { ticketId }],
      }); // 마치 실시간 채팅처럼 보이게

      // 입력 필드 초기화
      setMessage('');
      setFile(null);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <div className="bg-component rounded-md p-4 flex flex-col h-[460px]">
      <div
        ref={chatContainerRef}
        className="overflow-y-auto pr-2 flex-1 hide-scrollbar"
      >
        {displayLogs.map((log, index) => (
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
                className={`flex ${
                  log.role === user?.role ? 'justify-start' : 'justify-end'
                }`}
              >
                {log.role !== user?.role && (
                  <p className="self-end text-xs mr-2 text-gray-400">
                    {formatTime(log.createdAt)}
                  </p>
                )}
                <div
                  className={`max-w-[80%] p-2 rounded-lg ${
                    log.role === user?.role
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {log.message}
                </div>
                {log.role === user?.role && (
                  <p className="self-end text-xs ml-2 text-gray-400">
                    {formatTime(log.createdAt)}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex space-x-4 items-center mt-2">
        <label htmlFor="file-upload" className="cursor-pointer">
          <button
            className="bg-gray-200 rounded-lg p-2 hover:bg-gray-300 hover:rounded-xl"
            type="button"
          >
            <FiPaperclip className="text-xl text-gray-600" />
          </button>
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          className="flex-1 p-2 rounded-lg border border-gray-300"
        />

        <button
          onClick={handleSendMessage}
          disabled={!message.trim() && !file}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          type="button"
        >
          <FiSend className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default TicketComment;

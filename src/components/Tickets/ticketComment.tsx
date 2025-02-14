import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { FiPaperclip, FiSend, FiClock } from 'react-icons/fi';
import useUserStore from '@/stores/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { postComment } from '@/services/user';
import { formatTime } from '@/app/utils/formatTime';

interface Log {
  log?: string;
  message?: string | string[];
  role?: 'MANAGER' | 'USER';
  createdAt?: string;
}

export interface TicketCommentProps {
  logs: Log[];
  ticketId: string;
  status:string;
}

const TicketComment: React.FC<TicketCommentProps> = ({ logs, ticketId }) => {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const displayLogs =
    logs?.length === 0 ? [{ log: '소통 내역이 없습니다.' }] : logs;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !file) return;
    if (isLoading) return;

    try {
      setIsLoading(true);
      const attachments: File[] = file ? [file] : [];
      await postComment(ticketId, message, attachments);
      queryClient.refetchQueries({ queryKey: ['comments', { ticketId }] });
      setMessage('');
      setFile(null);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
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
      <div ref={chatContainerRef} className="overflow-y-auto pr-2 flex-1 hide-scrollbar">
        {displayLogs?.map((log, index) => (
          <div key={index} className="flex flex-col mb-2">
            {log.log && (
              <div className="flex items-center justify-center mb-1">
                <hr className="flex-grow border-gray-300" />
                <span className="text-xs text-gray-500 px-2 bg-gray-50">{log.log}</span>
                <hr className="flex-grow border-gray-300" />
              </div>
            )}
            {log.message && (
              <div className={`flex ${log.role !== user?.role ? 'justify-start' : 'justify-end'}`}>
                {log.role !== user?.role && (
                  <p className="self-end text-xs mr-2 text-gray-400">
                    {formatTime(log.createdAt)}
                  </p>
                )}
                <div
                  className={`max-w-[80%] p-2 rounded-lg ${
                    log.role === user?.role ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {Array.isArray(log.message) ? (
                    log.message.map((attachment, idx) => {
                      const fileName = attachment.split('/').pop();
                      const finalFileName = fileName.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/, '');
                      return (
                        <a
                          key={idx}
                          href={attachment}
                          download
                          className="text-blue-500 underline block"
                        >
                          {finalFileName}
                        </a>
                      );
                    })
                  ) : (
                    log.message
                  )}
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

      <div className="flex space-x-2 items-center mt-2">
        <button onClick={handleFileUploadClick} className="bg-gray-200 rounded-lg p-2 hover:bg-gray-300 hover:rounded-xl" type="button">
          <FiPaperclip className="text-xl text-gray-600" />
        </button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

        <button className="bg-red-100 rounded-lg p-2 hover:bg-red-200 hover:rounded-xl" type="button">
          <FiClock className="text-xl text-red-600" />
        </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          className="flex-1 p-2 rounded-lg border border-gray-300"
        />

        <button onClick={handleSendMessage} disabled={!message.trim() && !file} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" type="button">
          <FiSend className="text-xl" />
        </button>
      </div>

      {file && (
        <div className="text-sm text-gray-500 mt-1">
          첨부 파일: {file.name}
        </div>
      )}
    </div>
  );
};

export default TicketComment;
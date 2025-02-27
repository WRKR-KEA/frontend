import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { FiPaperclip, FiSend, FiClock } from 'react-icons/fi';
import useUserStore from '@/stores/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { postComment, postRemind } from '@/services/user';
import { formatTime } from '@/app/utils/formatTime';
import { useUserDetailQuery } from '@/hooks/useUserDetail';
import AlertModal from '../Modals/AlertModal';
import Modal from '../Modals/Modal';
import { FaFileAlt } from 'react-icons/fa'; 
import { useSSEStore } from '@/stores/sseStore';

interface Log {
  log?: string;
  message?: string | string[];
  attachment?: string | string[];
  role?: 'MANAGER' | 'USER';
  createdAt?: string;
}

export interface TicketCommentProps {
  logs: Log[];
  ticketId: string;
  status: string;
  requester: string;
  handler: string; 
}

const TicketComment: React.FC<TicketCommentProps> = ({ logs, ticketId, status, handler, requester }) => {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText: "",
    onClose: () => { },
    onClose2: () => { }
  });
  console.log("받은 로그", logs);


  const showModal = (title: string, btnText = '닫기') => {
    setModalState({
      isOpen: true,
      title,
      btnText,
      onClose: () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
      },
      onClose2: () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const { data: userData } = useUserDetailQuery();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const displayLogs = logs.length === 0 ? [{ log: '소통 내역이 없습니다.' }] : logs;

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    e.target.value = '';
  };

  const handleRemind = async () => {
    if (!userData?.memberId) {
      showModal('사용자 정보를 찾을 수 없습니다.');
      return;
    }
    try {
      const response = await postRemind(ticketId, { memberId: userData.memberId });
      if (response.result === true) {
        showModal('리마인더가 전송되었습니다.');
      } else {
        showModal('리마인더가 전송되지 않았습니다.');
      }
    } catch (error) {
      showModal('리마인더 전송에 실패했습니다.');
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !file) return;
    if (isLoading) return;

    try {
      setIsLoading(true);
      const attachments: File[] = file ? [file] : [];

      // 파일과 메시지 모두 전송
      await postComment(ticketId, message, attachments);
      queryClient.invalidateQueries({ queryKey: ['comments', { ticketId }] });

      // Clear message and file state after sending
      setMessage('');
      setFile(null);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const { messages } = useSSEStore();
  useEffect(() => {
    if (messages.length > 0 && messages[0].type == "comment") {
      queryClient.invalidateQueries({ queryKey: ['comments', { ticketId }] });
    }
  }, [messages, queryClient]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isTicketInProgress = status === 'IN_PROGRESS';
  const isAuthorized = user?.nickname === handler || requester;

  const isImage = (url) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = url.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
  };


  return (
    <div className="bg-component rounded-md p-4 flex flex-col h-[450px]">
      <div ref={chatContainerRef} className="overflow-y-auto pr-2 flex-1 hide-scrollbar">
        {displayLogs.map((log, index) => (
          <div key={index} className="flex flex-col mb-2">
            {log.log && (
              <div className="flex items-center justify-center mb-1">
                <hr className="flex-grow border-gray-300" />
                <span className="text-xs text-gray-500 px-2 bg-gray-50">{log.log}</span>
                <hr className="flex-grow border-gray-300" />
              </div>
            )}
            {(log.message || log.attachment) && (
              <div className={`flex ${log.role !== user?.role ? 'justify-start' : 'justify-end'}`}>
                {log.role === user?.role && (
                  <p className="self-end text-xs mr-2 text-gray-400">
                    {formatTime(log.createdAt)}
                  </p>
                )}
                <div
                  className={`max-w-[80%] p-2 rounded-lg ${
                    log.role === user?.role ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                  }`}
                >

                {/* 메시지 또는 첨부파일이 있는 경우 */}
                {(log.message || (log.attachment && log.attachment.length > 0)) && (
                  <div>
                    {/* 메시지가 있을 때만 표시 */}
                    {log.message !== "" && (
                      <div className={log.attachment.length > 0 ? "mb-2" : ""}>
                        <span>{log.message}</span>
                      </div>
                    )}
                    {/* 첨부파일이 있을 때만 표시 */}
                    {log.attachment.length > 0 && (
                      <div>
                        {(Array.isArray(log.attachment) ? log.attachment : [log.attachment]).map((attachment, idx) => {
                          const fileName = attachment.split('/').pop();
                          const finalFileName = fileName?.replace(
                            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/,
                            ''
                          );

                          return (
                            <div key={idx} className="">
                              {isImage(attachment) ? (
                                <a href={attachment} download>
                                  <div className="relative w-[300px]">
                                    <img
                                      src={attachment}
                                      alt="Attachment"
                                      className="w-[300px] object-cover hover:opacity-60"
                                    />
                                    <span className="absolute bottom-0 left-0 right-0 bg-gray-700 text-white text-xs text-center opacity-0 hover:opacity-100 transition-opacity duration-200 p-1">
                                      {finalFileName}
                                    </span>
                                  </div>
                                </a>
                              ) : (
                                <a href={attachment} download>
                                  <div className="relative w-[100px] h-[100px] flex items-center justify-center text-gray-700 hover:opacity-60">
                                    <FaFileAlt className="text-gray-500" size={100} />
                                    <span className="absolute bottom-0 left-0 right-0 bg-gray-700 text-white text-xs text-center opacity-0 hover:opacity-100 transition-opacity duration-200 p-1">
                                      {finalFileName}
                                    </span>
                                  </div>
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                </div>
                {log.role !== user?.role && (
                  <p className="self-end text-xs  text-left ml-2 text-gray-400">
                    {formatTime(log.createdAt)}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex space-x-2 items-center mt-2">
      <button
        onClick={handleFileUploadClick}
        className={`bg-gray-200 rounded-lg p-2 ${
          isTicketInProgress && isAuthorized ? 'hover:bg-gray-300' : 'cursor-not-allowed opacity-50 pointer-events-none'
        }`}
        type="button"
        disabled={!isTicketInProgress || !isAuthorized} // 여기서 기능을 막음
      >
        <FiPaperclip className="text-xl text-gray-600" />
      </button>
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

      <button
        onClick={handleRemind}
        className={`bg-red-100 rounded-lg p-2 ${
          isTicketInProgress && isAuthorized ? 'hover:bg-red-200' : 'cursor-not-allowed opacity-50 pointer-events-none'
        }`}
        type="button"
        disabled={!isTicketInProgress || !isAuthorized}
      >
        <FiClock className="text-xl text-red-600" />
      </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={!isTicketInProgress ? '진행 중인 티켓이 아닙니다.' : (isAuthorized ? '메시지를 입력하세요...' : '권한이 없습니다.')}
          className="flex-1 p-2 rounded-lg border border-gray-300"
          disabled={!isTicketInProgress || !isAuthorized}
        />

<button
  onClick={handleSendMessage}
  disabled={!isTicketInProgress || (!message.trim() && !file) || !isAuthorized}
  className={`p-2 bg-blue-500 text-white rounded-lg ${
    isTicketInProgress && isAuthorized && (message.trim() || file)
      ? 'hover:bg-blue-600'
      : 'cursor-not-allowed opacity-50 pointer-events-none'
  }`}
  type="button"
>
  <FiSend className="text-xl" />
</button>
      </div>

      {file && (
        <div className="text-sm text-gray-500 mt-1">
          첨부 파일: {file.name}
        </div>
      )}

      {modalState.isOpen && (
        <Modal onClose={modalState.onClose2}>
          <AlertModal
            title={modalState.title}
            onClick={modalState.onClose}
          />
        </Modal>
      )}
    </div>
  );
};

export default TicketComment;
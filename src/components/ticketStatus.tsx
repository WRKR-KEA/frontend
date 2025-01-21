import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';

export function TicketStatus({
  status,
}: {
  status: 'new' | 'rejected' | 'in-progress' | 'completed' | 'cancelled';
}) {
  const isRejected = status === 'rejected';
  const isInProgress = status === 'in-progress';
  const isCompleted = status === 'completed';
  const isNew = status === 'new';
  const isCancelled = status === 'cancelled';

  return (
    <div className={`bg-white p-4 rounded-md shadow-md flex-1 ${isRejected ? 'bg-opacity-50' : ''}`}>
      <h2 className="text-lg font-semibold mb-12">상태</h2>
      <div className="flex items-center justify-around relative">
        {/* 작업 요청 */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-300">
            <FaCheck className="text-white" /> {/* 작업 요청은 항상 체크 표시 */}
          </div>
          <span>작업 요청</span>
        </div>

        {/* 첫 번째 구분선 */}
        <div className="flex items-center relative">
          <hr className="w-32 border-t-2 border-gray-300 mb-4" />
          {isCancelled && (
            <div className="absolute flex flex-col items-center -top-3 left-1/2 transform -translate-x-1/2">
              <FaExclamationTriangle className="text-red-500 text-xl" />
              <span className="text-xs text-red-500">취소</span>
            </div>
          )}
        </div>

        {/* 작업 진행 */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isInProgress || isCompleted || isRejected ? 'bg-yellow-300' : 'bg-gray-200'
            }`}
          >
            {(isInProgress || isCompleted || isRejected) && <FaCheck className="text-white" />}
          </div>
          <span>작업 진행</span>
        </div>

        {/* 두 번째 구분선 */}
        <div className="flex items-center relative">
          <hr className="w-32 border-t-2 border-gray-300 mb-4" />
          {isRejected && (
            <div className="absolute flex flex-col items-center -top-3 left-1/2 transform -translate-x-1/2">
              <FaExclamationTriangle className="text-red-500 text-xl" />
              <span className="text-xs text-red-500">반려</span>
            </div>
          )}
        </div>

        {/* 작업 완료 */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isCompleted ? 'bg-yellow-300' : 'bg-gray-200'
            }`}
          >
            {isCompleted && <FaCheck className="text-white" />}
          </div>
          <span>작업 완료</span>
        </div>
      </div>
    </div>
  );
}
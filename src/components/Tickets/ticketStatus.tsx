import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';

export function TicketStatus({
  status,
}: {
  status: 'REQUEST' | 'REJECT' | 'IN_PROGRESS' | 'COMPLETE' | 'CANCEL';
}) {
  const isRejected = status === 'REJECT';
  const isInProgress = status === 'IN_PROGRESS';
  const isCompleted = status === 'COMPLETE';
  const isNew = status === 'REQUEST';
  const isCancelled = status === 'CANCEL';

  return (
    <div className={`bg-component p-4 rounded-md flex-1 min-w-96 mb-2 pb-12 ${isRejected ? 'bg-opacity-50' : ''}`}>
      <h2 className="text-md font-semibold mb-9">상태</h2>
      <div className="px-4">
        <div className="flex items-center justify-around relative">
          {/* 작업 요청 */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-300 mb-2">
              <FaCheck className="text-white" /> {/* 작업 요청은 항상 체크 표시 */}
            </div>
            <span className="absolute top-full text-center w-max px-2">작업 요청</span>
          </div>

          {/* 첫 번째 구분선 */}
          <div className="flex-1 items-center relative">
            <hr className="w-full border-t-2 border-gray-300 min-w-10 mb-2" />
            {isCancelled && (
              <div className="absolute flex flex-col items-center -top-3 left-1/2 transform -translate-x-1/2">
                <FaExclamationTriangle className="text-red-500 text-xl" />
                <span className="absolute w-8 ml-3 top-full text-xs text-red-500 mt-2">취소</span>
              </div>
            )}
          </div>

          {/* 작업 진행 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                isInProgress || isCompleted || isRejected ? 'bg-yellow-300' : 'bg-gray-200'
              }`}
            >
              {(isInProgress || isCompleted || isRejected) && <FaCheck className="text-white" />}
            </div>
            <span className="absolute top-full text-center w-max px-2">작업 진행</span>
          </div>

          {/* 두 번째 구분선 */}
          <div className="flex-1 items-center relative">
            <hr className="w-full border-t-2 border-gray-300 min-w-10 mb-2" />
            {isRejected && (
              <div className="absolute flex flex-col items-center -top-3 left-1/2 transform -translate-x-1/2">
                <FaExclamationTriangle className="text-red-500 text-xl" />
                <span className="absolute top-full text-xs w-max text-red-500 mt-2">반려</span>
              </div>
            )}
          </div>

          {/* 작업 완료 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                isCompleted ? 'bg-yellow-300' : 'bg-gray-200'
              }`}
            >
              {isCompleted && <FaCheck className="text-white" />}
            </div>
            <span className="absolute top-full text-center w-max px-2">작업 완료</span>
          </div>
        </div>
      </div>
    </div>
  );
}
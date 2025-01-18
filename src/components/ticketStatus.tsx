import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';  // 체크 아이콘과 주의 아이콘을 위한 라이브러리

export function TicketStatus({ status }: { status: 'new' | 'rejected' | 'in-progress' | 'completed' }) {
  const isRejected = status === 'rejected';
  const isInProgress = status === 'in-progress';
  const isCompleted = status === 'completed';
  const isNew = status === 'new';

  return (
    <div className={`bg-white p-4 rounded-md shadow-md flex-1 ${isRejected ? 'bg-opacity-50' : ''}`}>
      <h2 className="text-lg font-semibold mb-12">상태</h2>
      <div className="flex items-center justify-around">
        {/* 작업 요청 */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-300">
            <FaCheck className="text-white" /> {/* 작업 요청은 항상 체크 표시 */}
          </div>
          <span>작업 요청</span>
        </div>
        <span className="mb-4 text-gray-400">----------------</span> 

        {/* 작업 진행 */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-300">
            {(isInProgress || isCompleted || isRejected) && <FaCheck className="text-white" />} {/* 진행 중, 완료 상태에서 체크 표시 */}
          </div>
          <span>작업 진행</span>
        </div>
        <span className="mb-4 text-gray-400">----------------</span> 

        {/* 작업 완료 */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-300">
            {isCompleted && <FaCheck className="text-white" />} {/* 완료 상태에서 체크 표시 */}
            {isRejected && <FaExclamationTriangle className="text-red-500" />} {/* 반려 상태에서 주의 아이콘 */}
          </div>
          <span>작업 완료</span>
        </div>
      </div>
    </div>
  );
}

 {/* 승인 완료 */}
//  <div className="flex flex-col items-center">
//  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-300">
//    {(isInProgress || isCompleted || isRejected) && <FaCheck className="text-white" />} {/* 진행 중, 완료 상태에서 체크 표시 */}
//  </div>
//  <span>승인 완료</span>
// </div>
// <span className="mb-4 text-gray-400">----------</span> 
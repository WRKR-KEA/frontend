import React from 'react';

type FilterTab_ManagerProps = {
  activeTab: string;
  handleTabClick: (tab: string) => void;
};

export function FilterTab_Manager({ activeTab, handleTabClick }: FilterTab_ManagerProps) {
  return (
    <div className="flex border-gray-200 w-full items-center">
      <button
        onClick={() => handleTabClick("전체")}
        className={`w-20 text-center py-3 px-4 font-semibold text-sm ${
          activeTab === "전체" ? "border-b-2 border-black text-black" : "text-gray-500"
        }`}
      >
        전체
      </button>
      <button
        onClick={() => handleTabClick("작업완료")}
        className={`w-24 text-center py-3 px-4 font-semibold text-sm ${
          activeTab === "작업완료" ? "border-b-2 border-black text-black" : "text-gray-500"
        }`}
      >
        작업 완료
      </button>
      <button
        onClick={() => handleTabClick("작업진행")}
        className={`w-24 text-center py-3 px-4 font-semibold text-sm ${
          activeTab === "작업진행" ? "border-b-2 border-black text-black" : "text-gray-500"
        }`}
      >
        작업 진행
      </button>
      <button
        onClick={() => handleTabClick("반려")}
        className={`w-24 text-center py-3 px-4 font-semibold text-sm ${
          activeTab === "반려" ? "border-b-2 border-black text-black" : "text-gray-500"
        }`}
      >
        작업 반려
      </button>
      <button
        onClick={() => handleTabClick("작업취소")}
        className={`w-24 text-center py-3 px-4 font-semibold text-sm ${
          activeTab === "반려" ? "border-b-2 border-black text-black" : "text-gray-500"
        }`}
      >
        작업 취소
      </button>
    </div>
  );
}
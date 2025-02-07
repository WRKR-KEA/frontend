import React from 'react';

type FilterTabProps = {
  activeTab: string;
  handleTabClick: (tab: string) => void;
};

export function FilterTab({ activeTab, handleTabClick }: FilterTabProps) {
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
        onClick={() => handleTabClick("COMPLETE")}
        className={`w-24 text-center py-3 px-4 font-semibold text-sm ${
          activeTab === "COMPLETE" ? "border-b-2 border-black text-black" : "text-gray-500"
        }`}
      >
        작업 완료
      </button>
      <button
        onClick={() => handleTabClick("IN_PROGRESS")}
        className={`w-24 text-center py-3 px-4 font-semibold text-sm ${
          activeTab === "IN_PROGRESS" ? "border-b-2 border-black text-black" : "text-gray-500"
        }`}
      >
        작업 진행
      </button>
      <button
        onClick={() => handleTabClick("REQUEST")}
        className={`w-24 text-center py-3 px-4 font-semibold text-sm ${
          activeTab === "REQUEST" ? "border-b-2 border-black text-black" : "text-gray-500"
        }`}
      >
        작업 요청
      </button>
      <button
        onClick={() => handleTabClick("REJECT")}
        className={`w-24 text-center py-3 px-4 font-semibold text-sm ${
          activeTab === "REJECT" ? "border-b-2 border-black text-black" : "text-gray-500"
        }`}
      >
        작업 반려
      </button>
      <button
        onClick={() => handleTabClick("CANCEL")}
        className={`w-24 text-center py-3 px-4 font-semibold text-sm ${
          activeTab === "CANCEL" ? "border-b-2 border-black text-black" : "text-gray-500"
        }`}
      >
        작업 취소
      </button>
    </div>
  );
}
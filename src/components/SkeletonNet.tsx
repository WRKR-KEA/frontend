import React from "react";
import { Package, Ticket } from "lucide-react"; // 빈 상자 아이콘

interface SkeletonNetProps {
  width?: string;
  height?: string;
}

const Skeleton: React.FC<SkeletonNetProps> = ({ width = "100%", height = "20px" }) => {
  return (
    <div
      className="relative bg-component animate-pulse rounded-md"
      style={{ width, height }}
    >
      {/* 스켈레톤 UI */}
      <div
        className="bg-component animate-pulse rounded-md"
        style={{ width, height }}
      />

      {/* 아이콘과 텍스트를 가운데로 정렬 */}
      <div className="absolute flex flex-col items-center justify-center top-0 left-0 right-0 bottom-0">
        <Package className="w-16 h-16 text-gray-400" />
        {/* <Ticket className="w-16 h-16 text-gray-400" /> */}
        <p className="text-gray-500 text-lg mt-2">네트워크 오류가 발생했습니다.</p>
      </div>
    </div>
  );
};

export default Skeleton;

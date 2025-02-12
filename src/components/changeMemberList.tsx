import React, { useState } from "react";
import { useManagerListQuery } from '@/hooks/useManagerList';

interface Member {
  memberId: string; 
  nickname: string;
  position: string;
  phoneNumber: string;
  ticketAmount: number;
}

interface ChangeMemberListProps {
  onSelectManager: (managerId: string) => void;
}

const ChangeMemberList: React.FC<ChangeMemberListProps> = ({ onSelectManager }) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const { data, isLoading, error } = useManagerListQuery();

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

  const handleCheckboxChange = (index: number, managerId: string) => {
    // 선택된 행을 토글하고, 선택된 담당자의 ID를 부모로 전달
    setSelectedRowIndex((prevIndex) => (prevIndex === index ? null : index));
    onSelectManager(managerId);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-3">
      {/* 고정된 헤더 */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">담당자 변경</h2>
        <p className="text-sm text-gray-500">변경할 담당자를 선택해주세요.</p>
      </div>

      {/* 스크롤 가능한 테이블 */}
      <div className="max-h-[400px] overflow-y-auto border border-gray-300 rounded-md hide-scrollbar">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left w-10"></th>
              <th className="px-4 py-2 text-left">아이디</th>
              <th className="px-4 py-2 text-left w-24">직책</th>
              <th className="px-4 py-2 text-right w-24">담당 티켓</th>
            </tr>
          </thead>
          <tbody>
            {data.map((member, index) => (
              <tr
                key={member.memberId}
                className={index % 2 === 0 && "bg-component"}
              >
                <td className="px-4 py-2 w-10 min-w-10">
                  {index === 0 ? (
                    <input
                      type="checkbox"
                      checked={selectedRowIndex === index}
                      onChange={() => handleCheckboxChange(index, member.memberId)}
                      disabled
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={selectedRowIndex === index}
                      onChange={() => handleCheckboxChange(index, member.memberId)}
                    />
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.profileUrl || '/userProfileImage.png'}
                      alt="profile picture"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="truncate">{member.nickname}</span>
                  </div>
                </td>
                <td className="px-4 py-2">{member.position}</td>
                <td className="px-4 py-2 text-right">{member.ticketAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChangeMemberList;
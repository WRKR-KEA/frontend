import React, { useState } from "react";

interface Member {
  avatar: string;
  name: string;
  subject: string;
  phone: string;
  tickets: number;
}

interface ChangeMemberListProps {
  data: Member[];
}

const ChangeMemberList: React.FC<ChangeMemberListProps> = ({ data }) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const handleCheckboxChange = (index: number) => {
    // 선택된 행을 토글
    setSelectedRowIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="w-full max-w-md mx-auto mt-3">
      {/* 고정된 헤더 */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">담당자 변경하기</h2>
        <p className="text-sm text-gray-500">변경할 담당자를 선택해주세요.</p>
      </div>

      {/* 스크롤 가능한 테이블 */}
      <div className="max-h-[400px] overflow-y-auto border border-gray-300 rounded-md">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left"></th>
              <th className="p-3 text-left">이름</th>
              <th className="p-3 text-left">직책</th>
              <th className="p-3 text-left">전화번호</th>
              <th className="p-3 text-left">담당 티켓</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-[#6E61CA]/20" : ""}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedRowIndex === index}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </td>
                <td className="p-3 flex items-center space-x-3">
                  <img
                    src={row.avatar}
                    alt={row.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{row.name}</span>
                </td>
                <td className="p-4">{row.subject}</td>
                <td className="p-4">{row.phone}</td>
                <td className="p-4">{row.tickets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChangeMemberList;
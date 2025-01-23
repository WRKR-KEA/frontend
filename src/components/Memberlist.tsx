import React from "react";

interface Member {
  avatar: string;
  name: string;
  subject: string;
  phone: string;
  email: string;
  tickets: number;
}

interface MemberListProps {
  data: Member[];
}

const MemberList: React.FC<MemberListProps> = ({ data }) => {
  return (
    <div className="w-full mx-auto mt-3">
      <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden table-fixed">
        <thead>
          <tr>
            <th className="p-3 text-left w-[5%]">
              <input type="checkbox" />
            </th>
            <th className="p-3 text-left w-[20%]">이름</th>
            <th className="p-3 text-left w-[20%]">직책</th>
            <th className="p-3 text-left w-[20%]">전화번호</th>
            <th className="p-3 text-left w-[20%]">이메일 주소</th>
            <th className="p-3 text-left w-[15%]">담당 티켓</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-[#6E61CA]/20" : ""}
            >
              <td className="p-3 w-[5%]">
                <input type="checkbox" />
              </td>
              <td className="p-3 w-[20%] flex items-center space-x-3">
                <img
                  src={row.avatar}
                  alt={row.name}
                  className="w-8 h-8 rounded-full"
                />
                <span>{row.name}</span>
              </td>
              <td className="p-4 w-[20%]">{row.subject}</td>
              <td className="p-4 w-[20%]">{row.phone}</td>
              <td className="p-4 w-[25%]">{row.email}</td>
              <td className="p-4 w-[10%]">{row.tickets}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberList;

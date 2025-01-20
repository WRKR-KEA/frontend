import React, { useState } from "react";
import ChangeMemberList from "@/components/changeMemberList";
import Button from "@/components/Button";

const mockData = [
  {
    avatar: "/userProfileImage.png",
    name: "어피치",
    subject: "개발자",
    phone:"000-0000-0000",
    tickets: 5,
  },
  {
    avatar: "/userProfileImage.png",
    name: "라이언",
    subject: "디자이너",
    phone:"000-0000-0000",
    tickets: 3,
  },
  {
    avatar: "/userProfileImage.png",
    name: "춘식이",
    subject: "기획자",
    phone:"000-0000-0000",
    tickets: 7,
  },
  {
    avatar: "/userProfileImage.png",
    name: "네오",
    subject: "마케팅",
    phone:"000-0000-0000",
    tickets: 4,
  },
  {
    avatar: "/userProfileImage.png",
    name: "제이지",
    subject: "PM",
    phone:"000-0000-0000",
    tickets: 6,
  },
  {
    avatar: "/userProfileImage.png",
    name: "튜브",
    subject: "디자이너",
    phone:"000-0000-0000",
    tickets: 2,
  },
  {
    avatar: "/userProfileImage.png",
    name: "프로도",
    subject: "개발자",
    phone:"000-0000-0000",
    tickets: 8,
  },
  {
    avatar: "/userProfileImage.png",
    name: "콘",
    subject: "기획자",
    phone:"000-0000-0000",
    tickets: 5,
  },
  {
    avatar: "/userProfileImage.png",
    name: "무지",
    subject: "마케팅",
    phone:"000-0000-0000",
    tickets: 3,
  },
];

export default function TicketChangeModal() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const handleChange = () => {
    alert("변경되었습니다!"); // 변경 동작을 구현
    closeModal();
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-[500px] w-full">
          {/* 데이터를 표시할 리스트 컴포넌트 */}
          <div className="max-h-[500px] overflow-y-auto">
            <ChangeMemberList data={mockData} />
          </div>
          {/* 버튼 영역 */}
          <div className="mt-4 flex justify-center space-x-3">
          <Button label="취소" onClick={closeModal} color={4} />
          <Button label="변경하기" onClick={handleChange} color={1} />
          </div>
        </div>
      </div>
    )
  );
}
"use client";

import React, { use, useEffect, useState } from "react";
import { useMemberDetailQuery } from "@/hooks/useMemberDetail";

export default function AdminMemberDetailPage({ params }: { params: { memberId: string } }) {
  const { memberId } = use(params); // ✅ params 언래핑

  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({
    email: "",
    name: "",
    nickname: "",
    department: "",
    position: "",
    phone: "",
    role: "",
    profileImage: "",
  });

  // ✅ 멤버 상세 정보 가져오기
  const { data, isLoading, error, refetch } = useMemberDetailQuery(memberId);
  console.log("유저디테일정보", data);

  // ✅ 데이터 로딩 후 입력 필드 업데이트
  useEffect(() => {
    if (data) {
      setEditableData({
        email: data.email || "",
        name: data.name || "",
        nickname: data.nickname || "",
        department: data.department || "",
        position: data.position || "",
        phone: data.phone || "",
        role: data.role || "사용자", // 기본값 설정
        profileImage: data.profileImage || "",
      });
    }
  }, [data]);

  // ✅ 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ 멤버 정보 업데이트 요청
  const handleSave = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
      }

      const requestBody = {
        email: editableData.email.trim(),
        name: editableData.name.trim(),
        nickname: editableData.nickname.trim(),
        department: editableData.department.trim(),
        position: editableData.position.trim(),
        phone: editableData.phone.trim(),
        role: editableData.role === "사용자" ? "USER" : "MANAGER", // 역할 변환
        profileImage: editableData.profileImage.trim(),
      };

      console.log("🔹 업데이트 요청 데이터:", requestBody);

      const response = await fetch(`http://172.16.211.53:8080/api/admin/members/${memberId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("🔹 서버 응답 상태:", response.status, response.statusText);
      const responseData = await response.json();
      console.log("🔹 서버 응답 데이터:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "업데이트 실패");
      }
      
      refetch()
      alert("회원 정보가 성공적으로 수정되었습니다.");
      setIsEditing(false); // ✅ 수정 모드 종료
    } catch (error) {
      console.error("❌ 업데이트 요청 실패:", error);
      alert("회원 정보 수정에 실패했습니다.");
    }
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <div className="bg-gray-50 flex justify-center p-8">
      <div className="bg-white shadow-md rounded-lg p-12 w-full max-w-4xl">
        {/* 프로필 헤더 */}
        <div className="flex items-center space-x-6 border-b pb-6">
          <div className="relative">
            <img
              src={editableData.profileImage || "/adminProfile.png"}
              alt={editableData.name}
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
          <div className="w-full">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editableData.name}
                onChange={handleInputChange}
                className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 focus:outline-none w-full"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-800">{editableData.name}</h1>
            )}
            <div className="flex items-center text-gray-500 mt-2">
              <span>담당자</span>
            </div>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="grid grid-cols-2 gap-6 mt-6 text-gray-700">
          <div>
            <h2 className="text-sm font-semibold text-gray-500">이메일 주소</h2>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editableData.email}
                onChange={handleInputChange}
                className="w-full border-b-2 border-gray-300 px-2 py-1 focus:outline-none"
              />
            ) : (
              <a href={`mailto:${editableData.email}`} className="text-blue-500">
                {editableData.email}
              </a>
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500">전화번호</h2>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={editableData.phone}
                onChange={handleInputChange}
                className="w-full border-b-2 border-gray-300 px-2 py-1 focus:outline-none"
              />
            ) : (
              <p>{editableData.phone}</p>
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500">부서</h2>
            {isEditing ? (
              <input
                type="text"
                name="department"
                value={editableData.department}
                onChange={handleInputChange}
                className="w-full border-b-2 border-gray-300 px-2 py-1 focus:outline-none"
              />
            ) : (
              <p>{editableData.department}</p>
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500">직책</h2>
            {isEditing ? (
              <input
                type="text"
                name="position"
                value={editableData.position}
                onChange={handleInputChange}
                className="w-full border-b-2 border-gray-300 px-2 py-1 focus:outline-none"
              />
            ) : (
              <p>{editableData.position}</p>
            )}
          </div>
        </div>

        {/* 권한 선택 */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-500">권한</h2>
          {isEditing ? (
            <select
              name="role"
              value={editableData.role}
              onChange={handleInputChange}
              className="w-full border-b-2 border-gray-300 px-2 py-1 focus:outline-none"
            >
              <option value="사용자">사용자</option>
              <option value="담당자">담당자</option>
            </select>
          ) : (
            <p>{editableData.role}</p>
          )}
        </div>

        {/* 수정/저장 버튼 */}
        <div className="mt-6 flex justify-center">
          {isEditing ? (
            <button onClick={handleSave} className="px-6 py-2 bg-blue-500 text-white rounded-md">
              저장
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-gray-200 rounded-md">
              수정
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

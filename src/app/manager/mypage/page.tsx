"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/Modals/AlertModal";
import Modal from "@/components/Modals/Modal";

export default function UserProfilePage() {
  const router = useRouter();

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
    agitUrl: "",
    agitNotification: true,
    emailNotification: true,
    serviceNotification: true,
    kakaoworkNotification: true,
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText: '',
    onClose: () => {},
  });

  const showModal = (title: string, btnText='닫기') => {
    setModalState({
      isOpen: true,
      title,
      btnText,
      onClose: () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
      },
   
    });
  };

  // ✅ 사용자 마이페이지 회원 정보 가져오기
  const fetchUserProfile = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        showModal("로그인이 필요합니다.");
        return;
      }

      const response = await fetch("http://172.16.211.53:8080/api/user/my-page", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      console.log(response); // Log the response to debug
      const responseData = await response.json();
      console.log("🔹 사용자 마이페이지 정보:", responseData);

      if (response.ok) {
        setEditableData({
          email: responseData.result.email || "",
          name: responseData.result.name || "",
          nickname: responseData.result.nickname || "",
          department: responseData.result.department || "",
          position: responseData.result.position || "",
          phone: responseData.result.phone || "",
          role: responseData.result.role || "사용자", // 기본값 설정
          profileImage: responseData.result.profileImage || "",
          agitUrl: responseData.result.agitUrl || "",
          agitNotification: responseData.result.agitNotification || true,
          emailNotification: responseData.result.emailNotification || true,
          serviceNotification: responseData.result.serviceNotification || true,
          kakaoworkNotification: responseData.result.kakaoworkNotification || true,
        });
      } else {
        throw new Error(responseData.message || "회원 정보 조회 실패");
      }
    } catch (error) {
      console.error("❌ 사용자 정보 조회 실패:", error);
      showModal("회원 정보를 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // ✅ 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ 알림 설정 토글 핸들러
  const handleToggle = (name: string) => {
    setEditableData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // ✅ 사용자 정보 업데이트 요청
  const handleSave = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        showModal("로그인이 필요합니다.");
        return;
      }

      const requestBody = {
        name: editableData.name.trim(),
        phone: editableData.phone.trim(),
        email: editableData.email.trim(),
        position: editableData.position.trim(),
        agitUrl: editableData.agitUrl.trim(),
        department: editableData.department.trim(),
        agitNotification: editableData.agitNotification,
        emailNotification: editableData.emailNotification,
        serviceNotification: editableData.serviceNotification,
        kakaoworkNotification: editableData.kakaoworkNotification,
      };

      console.log("🔹 업데이트 요청 데이터:", requestBody);

      const response = await fetch("http://172.16.211.53:8080/api/user/my-page", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      console.log("🔹 서버 응답 데이터:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "업데이트 실패");
      }

      showModal("회원 정보가 성공적으로 수정되었습니다.");
      setIsEditing(false); // ✅ 수정 모드 종료
    } catch (error) {
      console.error("❌ 업데이트 요청 실패:", error);
      showModal("회원 정보 수정에 실패했습니다.");
    }
  };

  if (!editableData.email) return <p>로딩 중...</p>;

  return (
    <div className="bg-white flex justify-center p-8">
      <div className="bg-white shadow-md rounded-lg p-12 w-full max-w-4xl min-h-[600px]">
        {/* 상단 프로필 및 기본 정보 */}
        <div className="flex items-center justify-between border-b pb-6">
          {/* 프로필 이미지 & 사용자 정보 */}
          <div className="flex items-center space-x-8">
            <div className="relative">
              <img
                src={editableData.profileImage || "/adminProfile.png"}
                alt={editableData.name}
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <div className="space-y-2">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editableData.name}
                  onChange={handleInputChange}
                  className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 focus:outline-none h-10"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-800">{editableData.name}</h1>
              )}
              <div className="flex items-center space-x-4 text-gray-500">
                {isEditing ? (
                  <select
                    name="role"
                    value={editableData.role}
                    onChange={handleInputChange}
                    className="text-sm font-semibold text-gray-500 h-10"
                  >
                    <option value="사용자">사용자</option>
                    <option value="담당자">담당자</option>
                  </select>
                ) : (
                  <p>{editableData.role === "사용자" ? "사용자" : "담당자"}</p>
                )}
              </div>
            </div>
          </div>

          {/* 비밀번호 변경 버튼 (오른쪽 끝) */}

          <button
            onClick={() => router.push("/changepassword")}
            className="px-6 py-2 bg-red-500 text-white rounded-md ml-auto"
          >
            비밀번호 변경
          </button>
        </div>

        {/* 회원 정보 & 알림 설정 2열 배치 */}
        <div className="grid grid-cols-2 gap-12 mt-8">
          {/* 좌측: 회원 정보 */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">회원 정보</h2>
            <div className="border-t border-gray-300 mb-4"></div>

            {[
              { label: "이메일 주소", name: "email", type: "email" },
              { label: "전화번호", name: "phone", type: "tel" },
              { label: "아지트 URL", name: "agitUrl", type: "text" },
              { label: "부서", name: "department", type: "text" },
              { label: "직책", name: "position", type: "text" },
            ].map((field) => (
              <div key={field.name} className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 mb-2">{field.label}</h2>
                {isEditing ? (
                  <input
                    type={field.type}
                    name={field.name}
                    value={editableData[field.name]}
                    onChange={handleInputChange}
                    className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none h-10"
                  />
                ) : field.name === "email" || field.name === "agitUrl" ? (
                  <a href={editableData[field.name]} className="text-blue-500">
                    {editableData[field.name]}
                  </a>
                ) : (
                  <p className="text-gray-700">{editableData[field.name]}</p>
                )}
              </div>
            ))}
          </div>

          {/* 우측: 알림 설정 */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">알림 설정</h2>
            <div className="border-t border-gray-300 mb-4"></div>

            <div className="space-y-6">
              {[
                { label: "아지트 알림", name: "agitNotification" },
                { label: "이메일 알림", name: "emailNotification" },
                { label: "서비스 알림", name: "serviceNotification" },
              ].map((option) => (
                <div key={option.name} className="flex justify-between items-center">
                  <span className="text-gray-700">{option.label}</span>
                  {isEditing ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={editableData[option.name]}
                        onChange={() => handleToggle(option.name)}
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-900 relative transition">
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 transition"></div>
                      </div>
                    </label>
                  ) : (
                    <p className="text-gray-700">{editableData[option.name] ? "수신함" : "수신안함"}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

         {/* 수정/저장 버튼 */}
         <div className="mt-8 flex justify-center">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="px-6 py-3 bg-blue-500 text-white rounded-md">
                저장
              </button>
              <button onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-gray-200 rounded-md ml-4">
                취소
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-gray-200 rounded-md">
              수정
            </button>
          )}
        </div>
      </div>
      {modalState.isOpen && (
        <Modal onClose={modalState.onClose}>
          <AlertModal 
            title={modalState.title} 
            onClick={modalState.onClose} 
            btnText={modalState.btnText}
          />
        </Modal>
      )}
    </div>
  );
}
"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/Modals/AlertModal";
import Modal from "@/components/Modals/Modal";
import { useUserDetailQuery } from "@/hooks/useUserDetail";
import SkeletonNet from "@/components/SkeletonNet";
import Skeleton from "@/components/Skeleton"; 

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

     // ✅ 멤버 상세 정보 가져오기
    const { data, isLoading, error, refetch } = useUserDetailQuery();
    console.log("유저 디테일 정보:", data);
  
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
          agitUrl: data.agitUrl || "",
          agitNotification: data.agitNotification ?? true,
          emailNotification: data.emailNotification ?? true,
          serviceNotification: data.serviceNotification ?? true,
          kakaoworkNotification: data.kakaoworkNotification ?? true,
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
        //로그인 페이지로 렌더링
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/my-page`, {
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

  if (error) {
    return <SkeletonNet width="100%" height="100%" />;
  }

  if (isLoading) {
    return <Skeleton width="100%" height="100%" />;
  }

  return (
    <div className="bg-gray-50 flex flex-col items-center p-8">
      <h1 className="w-full max-w-4xl text-2xl font-bold text-gray-800 mb-4 text-left">회원 상세</h1>
      <div className="bg-white shadow-md rounded-lg p-12 w-full max-w-4xl min-h-[600px]">
        <div className="flex items-center justify-between border-b pb-6">
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
                  name="nickname"
                  value={editableData.nickname}
                  onChange={handleInputChange}
                  className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 focus:outline-none h-10"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-800">{editableData.nickname}</h1>
              )}
              <div className="flex items-center space-x-4 text-gray-500">
                <p>{editableData.role === "사용자" ? "사용자" : "담당자"}</p>
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
        <div className="grid grid-cols-2 gap-12 mt-8">
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">회원 정보</h2>
            <div className="border-t border-gray-300 mb-4"></div>

            {[
              { label: "이름", name: "name", type: "text" },
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
                  <label className={`relative inline-flex items-center cursor-pointer ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={editableData[option.name]}
                      onChange={() => handleToggle(option.name)}
                      disabled={!isEditing}
                    />
                    <div className="w-12 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full">
                      <div className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${editableData[option.name] ? 'translate-x-6' : 'translate-x-1'}`}
                        style={{ top: '2px' }}></div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="px-6 py-3 bg-blue-500 text-white rounded-md">
                저장
              </button>
              <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-gray-200 rounded-md ml-4">
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
          <AlertModal title={modalState.title} onClick={modalState.onClose} btnText={modalState.btnText} />
        </Modal>
      )}
    </div>
  );
}
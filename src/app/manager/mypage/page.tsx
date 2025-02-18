"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/Modals/AlertModal";
import Modal from "@/components/Modals/Modal";
import { useUserDetailQuery } from "@/hooks/useUserDetail";
import SkeletonNet from "@/components/SkeletonNet";
import Skeleton from "@/components/Skeleton";

export default function ManagerProfilePage() {
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
    btnText: "",
    onClose: () => {},
  });
  const [errors, setErrors] = useState({
    phone: "",
    name: "",
    email: "",
    department: "",
    position: "",
  });

  const showModal = (title: string, btnText = "닫기") => {
    setModalState({
      isOpen: true,
      title,
      btnText,
      onClose: () => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const { data, isLoading, error, refetch } = useUserDetailQuery();

  useEffect(() => {
    if (data) {
      setEditableData({
        email: data.email || "",
        name: data.name || "",
        nickname: data.nickname || "",
        department: data.department || "",
        position: data.position || "",
        phone: data.phone || "",
        role: data.role || "담당자", // 기본값 설정
        profileImage: data.profileImage || "",
        agitUrl: data.agitUrl || "",
        agitNotification: data.agitNotification ?? true,
        emailNotification: data.emailNotification ?? true,
        serviceNotification: data.serviceNotification ?? true,
        kakaoworkNotification: data.kakaoworkNotification ?? true,
      });
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (name === 'phone') {
      const inputElement = e.target as HTMLInputElement; // 명확하게 input 요소로 타입 단언
      const cursorPosition = inputElement.selectionStart; // 커서 위치 저장
  
      const numbers = value.replace(/[^\d]/g, ''); // 숫자만 남김
  
      let formattedNumber = '';
      if (numbers.length <= 3) {
        formattedNumber = numbers;
      } else if (numbers.length <= 7) {
        formattedNumber = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      } else {
        formattedNumber = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
      }
  
      setEditableData((prev) => ({ ...prev, [name]: formattedNumber }));
  
      // 상태 업데이트 후 커서 위치 복원
      requestAnimationFrame(() => {
        inputElement.selectionStart = inputElement.selectionEnd = cursorPosition!;
      });
    } else {
      setEditableData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggle = (name: string) => {
    setEditableData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const validateForm = () => {
    let valid = true;
    let newErrors: any = {};

    // 이름, 이메일, 부서, 직책 필드가 비어 있는지 확인
    if (!editableData.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
      valid = false;
    }
    if (!editableData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
      valid = false;
    }
    if (!editableData.department.trim()) {
      newErrors.department = "부서를 입력해주세요.";
      valid = false;
    }
    if (!editableData.position.trim()) {
      newErrors.position = "직책을 입력해주세요.";
      valid = false;
    }

    // 전화번호 형식 확인 (010-0000-0000 형식)
      const phoneRegex = /^010-\d{4}-\d{4}$/;
      if (!phoneRegex.test(editableData.phone)) {
        newErrors.phone = "전화번호는 010-0000-0000 형식으로 입력해주세요.";
        valid = false;
      }

      // 아지트 알림이 활성화되어 있는데 아지트 URL이 비어있으면 에러 처리
  if (editableData.agitNotification && !editableData.agitUrl.trim()) {
    newErrors.agitUrl = "아지트 알림을 활성화하려면 아지트 URL을 작성해주세요.";
    valid = false;
  }

  // 아지트 URL 형식 확인 (https://agit.io/webhook/ 로 시작해야 함)
  if (editableData.agitUrl.trim() && !editableData.agitUrl.startsWith("https://agit.io/webhook/")) {
    newErrors.agitUrl = "https://agit.io/webhook/ 로 시작하는 URL을 입력해주세요.";
    valid = false;
  }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    const isValid = validateForm();
    if (!isValid) return;

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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/my-page`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "업데이트 실패");
      }

      showModal("회원 정보가 성공적으로 수정되었습니다.");
      setIsEditing(false);
    } catch (error) {
      console.error("❌ 업데이트 요청 실패:", error);
      showModal("회원 정보 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);

    setErrors({
      phone: "",
      name: "",
      email: "",
      department: "",
      position: "",
    });
  
    // 여기서 refetch 호출을 추가해보기 전에 editableData를 최신 값으로 설정
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

  // 이후 refetch 호출
  refetch(); 
  };

  if (error) {
    return <SkeletonNet width="100%" height="100%" />;
  }

  if (isLoading) {
    return <Skeleton width="100%" height="100%" />;
  }

  return (
    <div className="bg-gray-50 flex flex-col items-center p-8">
      <div className="flex flex-col justify-between bg-white shadow-md rounded-lg p-12 w-full max-w-4xl min-h-[950px] h-[950px]">
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
                <h1 className="text-2xl font-semibold text-gray-800">{editableData.nickname}</h1>
                <div className="flex items-center space-x-4 text-gray-500">
                <p className='pt-2'>{editableData.role === "사용자" ? "사용자" : "담당자"}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push("/changepassword")}
            className="px-6 py-2 bg-red-500 text-white rounded-md ml-auto"
          >
            비밀번호 변경
          </button>
        </div>

        <div className="grid grid-cols-2 gap-12 mt-8">
        <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">회원 정보</h2>
            <div className="border-t border-gray-300 pb-4"></div>
            <div className={`${isEditing ? 'space-y-0.5' :'space-y-5'}`}>
            {[
              { label: "이름", name: "name", type: "text", required: true},
              { label: "이메일 주소", name: "email", type: "email", required: true},
              { label: "전화번호", name: "phone", type: "phone", required: true },
              { label: "아지트 URL", name: "agitUrl", type: "text" },
              { label: "부서", name: "department", type: "text", required: true },
              { label: "직책", name: "position", type: "text", required: true },
            ].map((field) => (
              <div key={field.name} className="pb-2">
                <h2 className="text-sm font-semibold text-gray-500">
                  {field.label}
                  {isEditing && field.required && (
                    <span className="text-red-500 ml-1 relative group cursor-default">
                      *
                      <span className="absolute left-1 bottom-0 text-red-500 text-xs px-2 py-1 rounded-md whitespace-nowrap group-hover:flex hidden">
                        필수 항목
                      </span>
                    </span>
                  )}
                </h2>
                {isEditing ? (
                  <>
                    <input
                      type={field.type}
                      name={field.name}
                      value={editableData[field.name]}
                      onChange={handleInputChange}
                      className={`w-full border-b-2 py-0 focus:outline-none h-10${errors[field.name] ? 'border-red-500' : 'border-gray-300  mb-5'}`}
                    />
                    {errors[field.name] && (
                      <p className="text-sm text-red-500 mt-1">{errors[field.name]}</p>
                    )}
                  </>
                ) : (
                  <p className="pt-1">{editableData[field.name]}</p>
                )}
              </div>
            ))}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">알림 설정</h2>
            <div className="border-t border-gray-300 pb-4"></div>
            <div className="space-y-6">
              {[
                { label: "아지트 알림", name: "agitNotification" },
                { label: "이메일 알림", name: "emailNotification" },
                { label: "서비스 알림", name: "serviceNotification" },
              ].map((option) => (
                <div key={option.name} className="flex justify-between items-center">
                  <span className="text-gray-700">{option.label}</span>
                  <label
                    className={`relative inline-flex items-center cursor-pointer ${
                      !isEditing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={editableData[option.name]}
                      onChange={() => handleToggle(option.name)}
                      disabled={!isEditing}
                    />
                    <div className="w-12 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full">
                      <div
                        className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out top-0.5 ${
                          editableData[option.name] ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="px-6 py-3 bg-blue-500 hover:bg-opacity-80 text-white rounded-md">
                저장
              </button>
              <button onClick={handleCancel} className="px-6 py-3 bg-gray-200 hover:bg-opacity-80 rounded-md ml-4">
                취소
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className=" px-6 py-3 bg-gray-200 hover:bg-opacity-80 rounded-md">
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
"use client";

import React, { useEffect, useState } from "react";
import { useMemberDetailQuery } from "@/hooks/useMemberDetail";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/Modals/Modal";
import AlertModal from "@/components/Modals/AlertModal";
import Button from "@/components/Buttons/Button";
import axios from "axios";
export default function AdminMemberDetailPage({ params }: { params: { memberId: string } }) {
  const { memberId } = useParams()
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
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText: "닫기",
    onClose: () => { },
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

  const { data, isLoading, error, refetch } = useMemberDetailQuery(memberId);


  useEffect(() => {
    if (data) {
      setEditableData({
        email: data.email || "",
        name: data.name || "",
        nickname: data.nickname || "",
        department: data.department || "",
        position: data.position || "",
        phone: data.phone || "",
        // role 값을 한글로 변환하여 저장
        role: data.role === "USER" ? "사용자" : "담당자",
        profileImage: data.profileImage || "",
        agitUrl: data.agitUrl || "",
      });
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        showModal("로그인이 필요합니다.");
        return;
      }

      // ✅ 최신 상태의 editableData 가져오기
      const updatedData = {
        email: editableData.email.trim(),
        name: editableData.name.trim(),
        nickname: editableData.nickname.trim(),
        department: editableData.department.trim(),
        position: editableData.position.trim(),
        phone: editableData.phone.trim(),
        // role 값을 서버 형식으로 변환
        role: editableData.role === "사용자" ? "USER" : "MANAGER",
        agitUrl: editableData.agitUrl.trim(),
      };

      console.log("🔹 전송할 데이터:", updatedData);

      const formData = new FormData();
      formData.append("request", new Blob([JSON.stringify(updatedData)], { type: "application/json" }));
      formData.append("profileImage", null);

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/members/${memberId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        await refetch();
        showModal("회원 정보가 성공적으로 수정되었습니다.");
        setIsEditing(false);
      } else {
        throw new Error(response.data?.message || "회원 정보 수정 실패");
      }
    } catch (error) {
      console.error("❌ 업데이트 요청 실패:", error);
      showModal((error?.response?.data?.message + " 누락된 정보가 있습니다.") || "회원 정보 수정에 실패했습니다.");
    }
  };



  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <div className="bg-gray-50 flex flex-col items-center p-8">
      <h1 className="w-full max-w-4xl text-2xl font-bold text-gray-800 mb-4 text-left">회원 상세</h1>

      <div className="bg-white shadow-md rounded-lg p-12 w-full max-w-4xl min-h-[600px]">
        {/* 프로필 및 기본 정보 */}
        <div className="flex items-center justify-between border-b pb-6">
          <div className="flex items-center space-x-8">
            <div className="relative">
              <input
                type="file"
                id="profileImageInput"
                accept="image/*"
                className="hidden"
                onChange={() => { }}

              />

              <img
                src={editableData.profileImage || "/adminProfile.png"}
                alt={editableData.name}
                className="w-32 h-32 rounded-full object-cover cursor-pointer"
                onClick={() => document.getElementById("profileImageInput")?.click()}
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
                  required
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-800">{editableData.nickname}</h1>
              )}

              <div className="flex items-center space-x-4 text-gray-500">

                <p>{editableData.role === "USER" ? "사용자" : "담당자"}</p>

              </div>
            </div>
          </div>
        </div>

        {/* 회원 정보 입력 폼 */}
        <div className="grid grid-cols-2 gap-6 mt-8">
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
                  value={editableData[field.name] || ""}
                  onChange={handleInputChange}
                  className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none h-10"
                  required
                />

              ) : (
                <p className="text-gray-700 px-2 py-2 border-b-2 border-transparent">{editableData[field.name] || "미등록"}</p>
              )}
            </div>
          ))}
        </div>


        {/* 수정/저장 버튼 */}
        <div className="mt-8 flex justify-center gap-4">
          {isEditing ? (
            <>
              <Button
                label="저장"
                onClick={handleSave}
                color={1}
                className=""
              />
              <Button
                label="취소"
                onClick={() => setIsEditing(false)}
                color={6}
                className=""
              />

            </>
          ) : (
            <Button
              label="수정"
              onClick={() => setIsEditing(true)}
              color={6}
              className=""
            />
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

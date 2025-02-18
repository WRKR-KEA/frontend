"use client";

import React, { useEffect, useState } from "react";
import { useMemberDetailQuery } from "@/hooks/useMemberDetail";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/Modals/Modal";
import AlertModal from "@/components/Modals/AlertModal";
import Button from "@/components/Buttons/Button";
import axios from "axios";
import Skeleton from "@/components/Skeleton";
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

  const formatPhoneNumber = (value: string) => {
    // 숫자만 남기기 (하이픈, 공백 제거)
    const phoneNumber = value.replace(/\D/g, "");
  
    if (phoneNumber.length <= 3) return phoneNumber;
    if (phoneNumber.length <= 7) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };
  
  // const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setEditableData((prev) => ({
  //     ...prev,
  //     [name]: formatPhoneNumber(value),
  //   }));
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name === "phone") {
      const inputElement = e.target as HTMLInputElement;
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

  const handleSave = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        showModal("로그인이 필요합니다.");
        return;
      }

      const updatedData = {
        email: editableData.email.trim(),
        name: editableData.name.trim(),
        nickname: editableData.nickname.trim(),
        department: editableData.department.trim(),
        position: editableData.position.trim(),
        phone: editableData.phone.trim(),
        role: editableData.role === "사용자" ? "USER" : "MANAGER",
        agitUrl: editableData.agitUrl.trim(),
      };

      const formData = new FormData();
      formData.append("request", new Blob([JSON.stringify(updatedData)], { type: "application/json" }));

      // ✅ 프로필 이미지가 있으면 추가
      if (editableData.profileImageFile) {
        formData.append("profileImage", editableData.profileImageFile);
      }

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
        throw response.data;
      }

    } catch (error) {
      console.error("❌ 회원 등록 중 오류 발생:", error);

      // ✅ 에러 응답에서 첫 번째 오류 메시지 추출
      if (axios.isAxiosError(error) && error.response?.data?.result) {
        const firstKey = Object.keys(error.response.data.result)?.[0]; // 첫 번째 key 가져오기
        const firstValue = firstKey ? error.response.data.result[firstKey] : "알 수 없는 오류";
        showModal(`${firstValue}`);
      } else {
        showModal(error.response.data.message);
      }
    } finally {
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // ✅ 파일 미리보기 (FileReader 사용)
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditableData((prev) => ({
          ...prev,
          profileImage: reader.result as string, // Base64 URL 저장 (미리보기용)
        }));
      };
      reader.readAsDataURL(file);

      // ✅ 상태에 파일 저장 (서버 전송용)
      setEditableData((prev) => ({
        ...prev,
        profileImageFile: file, // 실제 파일 저장 (FormData 전송 시 필요)
      }));
    }
  };



  if (isLoading) {
    return <Skeleton width={"100%"} height={"100%"} />
  }

  if (error) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <div className="bg-gray-50 flex flex-col items-center p-8">
      <h1 className="w-full max-w-4xl text-2xl font-bold text-gray-800 mb-4 text-left">회원 상세</h1>

      <div className="bg-white shadow-md rounded-lg p-12 w-full max-w-4xl min-h-[600px]">
        {/* 프로필 및 기본 정보 */}
        <div className="flex items-center justify-between border-b pb-6">
          <div className="flex items-center space-x-8">
            <div className="relative">
              {/* 파일 업로드 input (숨김) */}
              <input
                type="file"
                id="profileImageInput"
                accept="image/*"
                className="hidden"
                onChange={isEditing ? handleFileChange : undefined} // 수정 모드일 때만 파일 변경 허용
              />

              {/* 프로필 이미지 (미리보기) */}
              <img
                src={editableData.profileImage || "/adminProfile.png"}
                alt={editableData.name}
                className={`w-32 h-32 rounded-full object-cover ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                onClick={isEditing ? () => document.getElementById("profileImageInput")?.click() : undefined}
              />


              {isEditing && (
                <div
                  className="absolute bottom-1 right-1 bg-[#252e66] text-white p-2 rounded-full cursor-pointer shadow-md"
                  onClick={() => document.getElementById("profileImageInput")?.click()}
                >
                  <svg width="18" height="18" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.90316 23.1742H24.0937C26.5312 23.1742 27.7737 21.9552 27.7737 19.5412V7.27167C27.7737 4.85767 26.5312 3.65067 24.0937 3.65067H21.3517C20.4377 3.65067 20.1567 3.46317 19.6292 2.87717L18.6797 1.82217C18.1057 1.17817 17.5082 0.826172 16.2892 0.826172H11.6252C10.4182 0.826172 9.82016 1.17817 9.23466 1.82217L8.28516 2.87717C7.76966 3.45117 7.47666 3.65067 6.56266 3.65067H3.90266C1.46516 3.65067 0.222656 4.85767 0.222656 7.27167V19.5412C0.222656 21.9552 1.46566 23.1742 3.90316 23.1742ZM3.93766 21.2872C2.77766 21.2872 2.10966 20.6662 2.10966 19.4472V7.37717C2.10966 6.15817 2.77766 5.53717 3.93766 5.53717H7.03116C8.08616 5.53717 8.64866 5.33817 9.23466 4.68217L10.1602 3.65067C10.8282 2.90067 11.1682 2.71317 12.2112 2.71317H15.7032C16.7462 2.71317 17.0862 2.90067 17.7542 3.65067L18.6797 4.68167C19.2657 5.33817 19.8282 5.53717 20.8832 5.53717H24.0587C25.2187 5.53717 25.8872 6.15817 25.8872 7.37717V19.4472C25.8872 20.6662 25.2192 21.2872 24.0587 21.2872H3.93766ZM13.9927 19.4242C14.8345 19.4266 15.6686 19.2623 16.4467 18.9409C17.2248 18.6194 17.9316 18.1472 18.5263 17.5513C19.121 16.9555 19.592 16.2478 19.9119 15.4691C20.2319 14.6904 20.3946 13.856 20.3907 13.0142C20.3907 9.45117 17.5547 6.60417 13.9922 6.60417C10.4532 6.60417 7.60566 9.45117 7.60566 13.0142C7.60566 16.5762 10.4532 19.4242 13.9922 19.4242M22.4177 10.1542C23.2147 10.1542 23.8707 9.51017 23.8707 8.71317C23.8707 8.32781 23.7176 7.95824 23.4451 7.68575C23.1726 7.41325 22.803 7.26017 22.4177 7.26017C22.0323 7.26017 21.6627 7.41325 21.3902 7.68575C21.1177 7.95824 20.9647 8.32781 20.9647 8.71317C20.9647 9.51017 21.6207 10.1542 22.4177 10.1542ZM13.9927 17.6432C11.4497 17.6432 9.37566 15.5807 9.37566 13.0142C9.37566 10.4477 11.4382 8.38567 13.9927 8.38567C14.6007 8.38495 15.2029 8.50417 15.7648 8.73651C16.3267 8.96885 16.8373 9.30975 17.2673 9.73968C17.6973 10.1696 18.0382 10.6801 18.2706 11.242C18.503 11.8039 18.6223 12.4061 18.6217 13.0142C18.6224 13.6223 18.5031 14.2245 18.2708 14.7865C18.0384 15.3484 17.6975 15.859 17.2675 16.289C16.8375 16.719 16.3269 17.0599 15.765 17.2923C15.203 17.5247 14.6007 17.6439 13.9927 17.6432Z" fill="white" />
                  </svg>

                </div>
              )}
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

                <p>{data.role === "USER" ? "사용자" : "담당자"}</p>

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
                onClick={() => {
                  setIsEditing(false)
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
                }}
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

"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Button from "@/components/Buttons/Button";
import { fetchMemberRegisterExcelForm, postMemberRegisterExcelFile } from "@/services/admin";
import AlertModal from "@/components/Modals/AlertModal";
import Modal from "@/components/Modals/Modal";

const AdminMemberEnrollPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    nickname: "",
    department: "",
    phone: "",
    position: "",
    role: "",
    profileImageFile: null,
    agitUrl: ""
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText: '',
    onClose: () => { },
  });



  const showModal = (title: string, btnText = '닫기') => {
    setModalState({
      isOpen: true,
      title,
      btnText,
      onClose: () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
      },

    });
  };

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      showModal("로그인이 필요합니다. 다시 로그인해 주세요.");
      setLoading(false);
      return;
    }

    // ✅ FormData 객체 생성 (파일 + JSON 데이터 포함)
    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email.trim());
    formDataToSend.append("name", formData.name.trim());
    formDataToSend.append("nickname", formData.nickname.trim());
    formDataToSend.append("department", formData.department.trim());
    formDataToSend.append("phone", formData.phone.trim());
    formDataToSend.append("position", formData.position.trim());
    formDataToSend.append("role", formData.role);

    // ✅ 파일이 있으면 FormData에 추가
    if (formData.profileImageFile) {
      formDataToSend.append("profileImage", formData.profileImageFile);
    }

    try {
      const response = await fetch("http://172.16.211.53:8080/api/admin/members", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`, // ✅ 인증 토큰 추가
        },
        body: formDataToSend, // ✅ multipart/form-data 형식으로 전송
      });

      const data = await response.json();
      console.log("서버 응답:", data); // ✅ 서버 응답 확인

      if (response.ok) {
        showModal("회원이 성공적으로 등록되었습니다.");
        setFormData({
          email: "",
          name: "",
          nickname: "",
          department: "",
          phone: "",
          position: "",
          role: "사용자", // 기본값 유지
          profileImageFile: null, // 파일 리셋
          agitUrl: ""
        });
      } else {
        showModal(`회원 등록 실패: ${data.message || "서버에서 요청을 거부했습니다."}`);
      }
    } catch (error) {
      console.error("회원 등록 중 오류 발생:", error);
      showModal("회원 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };


  // 양식 다운로드 핸들러
  const handleDownloadTemplate = async () => {
    try {
      const data = await fetchMemberRegisterExcelForm(); // API 호출
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "회원등록양식.xlsx"; // 다운로드할 파일 이름
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("양식 다운로드 중 오류 발생:", error);
      showModal("양식 다운로드 중 오류가 발생했습니다.");
    }
  };

  // 회원 정보 업로드 핸들러
  const handleUploadMembers = async (file: File) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (file.size > MAX_FILE_SIZE) {
      showModal("파일 크기가 5MB를 초과할 수 없습니다.");
      return;
    }

    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      showModal("로그인이 필요합니다. 다시 로그인해 주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await postMemberRegisterExcelFile(formData); // API 호출
      if (response.isSuccess) {
        showModal("회원 정보가 성공적으로 업로드되었습니다.");
      } else {
        showModal(`회원 정보 업로드 실패: ${response.message}`);
      }
    } catch (error) {
      console.error("회원 정보 업로드 중 오류 발생:", error);
      showModal("회원 정보 업로드 중 오류가 발생했습니다.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // 미리보기를 위해 파일을 URL로 변환
      const fileURL = URL.createObjectURL(file);

      // 상태 업데이트
      setFormData((prev) => ({
        ...prev,
        profileImage: fileURL, // 미리보기용 URL
        profileImageFile: file, // 실제 파일
      }));
    }
  };

  return (
    <div className="bg-gray-50 flex justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* 제목을 왼쪽 상단으로 배치 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">회원 등록</h1>

        <div className="bg-white shadow-md rounded-lg p-12">
          {/* 상단 프로필 및 기본 정보 */}
          <div className="flex items-center border-b pb-6 mb-6">
            {/* 프로필 이미지 & 사용자 정보 */}
            <div className="flex items-center space-x-8">
              <div className="relative">
                {/* 숨겨진 파일 업로드 input */}
                <input
                  type="file"
                  id="profileImageInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange} // 파일 변경 시 처리
                />

                {/* 프로필 이미지 미리보기 */}
                <img
                  src={formData.profileImage || "/default-avatar.png"} // 기본 이미지 설정
                  alt="프로필 이미지"
                  className="w-32 h-32 rounded-full object-cover cursor-pointer min-w-32"
                  onClick={() => document.getElementById("profileImageInput")?.click()} // 클릭 시 파일 업로드 창 열기
                />
              </div>

              <div className="space-y-4"> {/* 여백 추가 */}
                {/* 닉네임 입력 */}
                <input
                  type="text"
                  name="nickname"
                  placeholder="닉네임을 입력하세요"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 focus:outline-none h-10"
                />

                {/* 역할 선택 */}
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="text-sm font-semibold text-gray-500"
                >
                  <option value="사용자">사용자</option>
                  <option value="담당자">담당자</option>
                </select>
              </div>
            </div>

            {/* 버튼 추가 */}
            <div className="flex justify-end ml-20"> {/* 여백 추가 */}
              <Button
                label={
                  <>
                    양식<br />
                    다운로드
                  </>
                }
                onClick={handleDownloadTemplate}
                color={1} // 파란색
                className="mr-2"
              />
              <Button
                label={
                  <>
                    회원 정보<br />
                    업로드
                  </>
                }
                onClick={() => {
                  const fileInput = document.createElement('input');
                  fileInput.type = 'file';
                  fileInput.accept = '.xlsx, .xls'; // 엑셀 파일(.xlsx 및 .xls) 모두 허용
                  fileInput.onchange = (e) => {
                    const target = e.target as HTMLInputElement; // 타입 단언
                    const file = target.files?.[0]; // 파일 선택
                    if (file) {
                      handleUploadMembers(file);
                    }
                  };
                  fileInput.click(); // 파일 선택 대화상자 열기
                }}
                color={3} // 초록색
              />
            </div>
          </div>




          {/* 회원 등록 폼 */}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* 이름 */}
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-600 mb-2">이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
                placeholder="이름을 입력하세요"
                required
              />
            </div>

            {/* 이메일 주소 */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">이메일 주소</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
                placeholder="이메일 주소를 입력하세요"
                required
              />
            </div>

            {/* 닉네임 */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">아지트 URL</label>
              <input
                type="text"
                name="agitUrl"
                value={formData.agitUrl}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
                placeholder="아지트 URL을 입력하세요"
                required
              />
            </div>

            {/* 부서 */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">부서</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
                placeholder="부서를 입력하세요"
                required
              />
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">전화번호</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
                placeholder="010-1234-5678"
                required
              />
            </div>

            {/* 직책 */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">직책</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
                placeholder="직책을 입력하세요"
                required
              />
            </div>




            {/* 등록 버튼 */}
            <div className="col-span-2 mt-8">
              <button
                type="submit"
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-300"
                disabled={loading}
              >
                {loading ? "등록 중..." : "회원 등록하기"}
              </button>
            </div>
          </form>
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
    </div>
  );
};

export default AdminMemberEnrollPage;


"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation'; 
import { format } from 'date-fns';
import Button from "@/components/Buttons/Button";
import { fetchMemberRegisterExcelForm, postMemberRegisterExcelFile } from "@/services/admin";

const AdminMemberEnrollPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    nickname: "",
    department: "",
    phone: "",
    position: "",
    role: "",
    profileImage: "",
  });

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
      alert("로그인이 필요합니다. 다시 로그인해 주세요.");
      setLoading(false);
      return;
    }

    const payload = {
      email: formData.email.trim() || undefined, // 공백 제거
      name: formData.name.trim() || undefined,
      nickname: formData.nickname.trim() || undefined,
      department: formData.department.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      position: formData.position.trim() || undefined,
      role: formData.role || undefined,
      profileImage: formData.profileImage || undefined,
    };
    
    console.log("보낼 데이터:", payload); // ✅ 실제 보내는 데이터 확인

    try {
      const response = await fetch("http://172.16.211.53:8080/api/admin/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // ✅ accessToken 추가
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("서버 응답:", data); // ✅ 서버 응답 확인

      if (response.ok) {
        alert("회원이 성공적으로 등록되었습니다.");
        setFormData({ // 입력 폼 초기화
          email: "",
          name: "",
          nickname: "",
          department: "",
          phone: "",
          position: "",
          role: "",
          profileImage: "",
        });
      } else {
        alert(`회원 등록 실패: ${data.message || "서버에서 요청을 거부했습니다."}`);
      }
    } catch (error) {
      console.error("회원 등록 중 오류 발생:", error);
      alert("회원 등록 중 오류가 발생했습니다.");
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
    alert("양식 다운로드 중 오류가 발생했습니다.");
  }
};

// 회원 정보 업로드 핸들러
const handleUploadMembers = async (file: File) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  
  if (file.size > MAX_FILE_SIZE) {
    alert("파일 크기가 5MB를 초과할 수 없습니다.");
    return;
  }

  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    alert("로그인이 필요합니다. 다시 로그인해 주세요.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await postMemberRegisterExcelFile(formData); // API 호출
    if (response.isSuccess) {
      alert("회원 정보가 성공적으로 업로드되었습니다.");
      router.push('/administer/memberlist'); // 회원 목록 페이지로 라우팅
    } else {
      alert(`회원 정보 업로드 실패: ${response.message}`);
    }
  } catch (error) {
    console.error("회원 정보 업로드 중 오류 발생:", error);
    alert("회원 정보 업로드 중 오류가 발생했습니다.");
  }
};


  return (
    <div className="bg-gray-50 flex justify-center p-8">
      <div className="bg-white shadow-md rounded-lg p-12 w-full max-w-4xl">
        {/* 헤더 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          회원 등록
        </h1>

        {/* 버튼 추가 */}
        <div className="flex justify-end mb-4">
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
            <label className="block text-sm font-semibold text-gray-600 mb-2">닉네임</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
              placeholder="닉네임을 입력하세요"
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

          {/* 권한 */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">권한</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
              required
            >
              <option value="">권한을 선택하세요</option>
              <option value="MANAGER">담당자</option>
              <option value="USER">사용자</option>
            </select>
          </div>

          {/* 프로필 이미지 */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">프로필 이미지 URL</label>
            <input
              type="text"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
              placeholder="프로필 이미지 URL을 입력하세요"
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
    </div>
  );
};

export default AdminMemberEnrollPage;


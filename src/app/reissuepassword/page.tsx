"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api/axios"; 
import AlertModal from "@/components/Modals/AlertModal";
import Modal from "@/components/Modals/Modal";

export default function ReissuePasswordPage() {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText:'',
    onClose: () => {},    
  });

  const showModal = (title: string, btnText='닫기', redirect = false, redirectPath = "") => {
    setModalState({
      isOpen: true,
      title,
      btnText,
      onClose: () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
        if (redirect && redirectPath) {
          router.push(redirectPath);
        }
      },
      redirect,
      redirectPath,
    });
  };

  // 닉네임 입력 처리 및 유효성 검사
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);

    // 아이디 형식 검증
    const nicknameRegex = /^[a-z]{3,10}\.[a-z]{1,5}$/;
    if (!nicknameRegex.test(e.target.value)) {
      setError("아이디 형식이 올바르지 않습니다.");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 아이디 유효성 검사
    if (error || nickname === "") {
      showModal("유효한 아이디를 입력하세요.");
      return;
    }

    try {
      const response = await api.patch("/api/members/password/reissue", {
        nickname,
      });

      if (response.data.isSuccess) {
        showModal('비밀번호 재발급 성공!', '로그인하기',true,'/login')
      } else {
        showModal(response.data.message || "비밀번호 재발급에 실패했습니다.");
      }
    } catch (err) {
      console.error("비밀번호 재발급 에러:", err);
      showModal("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#252E66]/80">
      {/* 헤더 */}
      <header className="absolute top-0 w-full bg-white py-4 shadow-sm">
        <div className="w-full flex items-center justify-between px-6">
          {/* 로고 */}
          <img src="/loginLogo.png" className="w-32" alt="Logo" />
          {/* 로그인 버튼 */}
          <a
            href="/login"
            className="px-4 py-2 bg-[#252E66] text-white text-sm font-semibold rounded-md hover:bg-[#1F2557]"
          >
            로그인
          </a>
        </div>
      </header>

      {/* 비밀번호 재발급 박스 */}
      <div className="bg-white rounded-lg shadow-md px-20 pb-14 pt-20">
        <h2 className="text-3xl font-bold mb-2">비밀번호 재발급</h2>
        <p className="text-sm text-gray-600 mb-6">
          재발급받을 아이디를 입력하세요.
        </p>

        {/* 비밀번호 재발급 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text" // type을 "nickname"에서 "text"로 변경
              id="nickname"
              value={nickname}
              onChange={handleNicknameChange}
              className="w-[440px] px-3 py-4 border rounded-md focus:ring-2 focus:ring-[#252E66] focus:outline-none"
              placeholder="아이디를 입력하세요"
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#252E66] text-white py-3 rounded-md font-semibold hover:bg-[#1F2557]"
          >
            비밀번호 재발급
          </button>
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
  );
}

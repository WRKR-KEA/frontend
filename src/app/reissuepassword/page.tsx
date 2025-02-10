"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api/axios";
import AlertModal from "@/components/Modals/AlertModal";
import Modal from "@/components/Modals/Modal";

export default function ReissuePasswordPage() {
  const [nickname, setNickname] = useState("");
  const [authCode, setAuthCode] = useState(""); // 인증번호 상태 추가
  const [error, setError] = useState("");
  const [isAuthSent, setIsAuthSent] = useState(false); // 인증번호 입력 필드 표시 여부
  const router = useRouter();

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText: "닫기",
    onClose: () => {},
  });

  const showModal = (title: string, btnText = "닫기", redirect = false, redirectPath = "") => {
    setModalState({
      isOpen: true,
      title,
      btnText,
      onClose: () => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
        if (redirect && redirectPath) {
          router.push(redirectPath);
        }
      },
    });
  };

  // 닉네임 입력 처리 및 유효성 검사
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);

    // 닉네임 형식 검증
    const nicknameRegex = /^[a-z]{3,10}\.[a-z]{1,5}$/;
    if (!nicknameRegex.test(e.target.value)) {
      setError("아이디 형식이 올바르지 않습니다.");
    } else {
      setError("");
    }
  };

  // 인증번호 입력 처리
  const handleAuthCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthCode(e.target.value);
  };

  // ✅ 인증번호 요청 (닉네임 입력 후)
  const handleRequestAuthCode = async () => {
    if (error || nickname === "") {
      showModal("유효한 닉네임을 입력하세요.");
      return;
    }

    try {
      const response = await api.post("/api/members/auth-code", { nickname });

      if (response.data.isSuccess) {
        setIsAuthSent(true); // 인증번호 입력 필드 표시
        showModal("인증번호가 전송되었습니다.", "확인");
      } else {
        showModal(response.data.message || "인증번호 요청 실패");
      }
    } catch (err) {
      console.error("인증번호 요청 에러:", err);
      showModal("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  // ✅ 인증번호 확인 후 비밀번호 재발급 요청
  const handleVerifyAndReissuePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authCode.length !== 6) {
      showModal("올바른 인증번호를 입력하세요.");
      return;
    }

    try {
      const response = await api.patch("/api/members/password/reissue", {
        nickname,
        authCode,
      });

      if (response.data.isSuccess) {
        showModal("비밀번호 재발급 성공!", "로그인하기", true, "/login");
      } else {
        showModal(response.data.message || "비밀번호 재발급 실패");
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
        <p className="text-sm text-gray-600 mb-6">재발급받을 아이디를 입력하세요.</p>

        {/* 인증번호 요청 폼 */}
        <form onSubmit={handleVerifyAndReissuePassword}>
          <div className="mb-4">
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={handleNicknameChange}
              className="w-[440px] px-3 py-4 border rounded-md focus:ring-2 focus:ring-[#252E66] focus:outline-none"
              placeholder="아이디를 입력하세요"
              disabled={isAuthSent} // 인증번호 입력 후 닉네임 수정 불가
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {!isAuthSent ? (
            // 인증번호 받기 버튼
            <button
              type="button"
              className="w-full bg-[#252E66] text-white py-3 rounded-md font-semibold hover:bg-[#1F2557]"
              onClick={handleRequestAuthCode}
            >
              인증번호 받기
            </button>
          ) : (
            <>
              {/* 인증번호 입력 필드 */}
              <div className="mt-4 mb-4">
                <input
                  type="text"
                  id="authCode"
                  value={authCode}
                  onChange={handleAuthCodeChange}
                  className="w-[440px] px-3 py-4 border rounded-md focus:ring-2 focus:ring-[#252E66] focus:outline-none"
                  placeholder="인증번호를 입력하세요"
                />
              </div>

              {/* 비밀번호 재발급 버튼 */}
              <button
                type="submit"
                className="w-full bg-[#252E66] text-white py-3 rounded-md font-semibold hover:bg-[#1F2557]"
              >
                확인
              </button>
            </>
          )}
        </form>
      </div>

      {/* 모달 */}
      {modalState.isOpen && (
        <Modal onClose={modalState.onClose}>
          <AlertModal title={modalState.title} onClick={modalState.onClose} btnText={modalState.btnText} />
        </Modal>
      )}
    </div>
  );
}

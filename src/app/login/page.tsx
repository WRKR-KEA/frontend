"use client";
import { useState } from "react";

export default function LoginPage() {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const handlenicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);

    // 아이디 형식 검증
    const nicknameRegex = /^[a-zA-Z0-9._%+-]+@gachon\.ac\.kr$/;
    if (!nicknameRegex.test(e.target.value)) {
      setError("아이디 형식이 올바르지 않습니다.");
    } else {
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 아이디 유효성 검사
    if (error || nickname === "") {
      alert("유효한 아이디를 입력하세요.");
      return;
    }

    alert("로그인 성공!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#252E66]/80">
      {/* 헤더 */}
      <header className="absolute top-0 w-full bg-white py-4 shadow-sm">
        <div className="w-full flex items-center justify-between px-6">
          {/* 로고 */}
          <img src="/loginLogo.png" className="w-32" />
          {/* 로그인 버튼 */}
          <a
            href="#"
            className="px-4 py-2 bg-[#252E66] text-white text-sm font-semibold rounded-md hover:bg-[#1F2557]"
          >
            로그인
          </a>
        </div>
      </header>

      {/* 로그인 박스 */}
      <div className="bg-white rounded-lg shadow-md px-20 pb-14 pt-20">
        <h2 className="text-3xl font-bold mb-2">로그인</h2>
        <p className="text-sm text-gray-600 mb-6">
          서비스를 사용하려면 로그인하세요.
        </p>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="nickname"
              id="nickname"
              value={nickname}
              onChange={handlenicknameChange}
              className="w-[440px] px-3 py-4 border rounded-md focus:ring-2 focus:ring-[#252E66] focus:outline-none"
              placeholder="아이디를 입력하세요"
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
          <div className="mb-6">
            <input
              type="password"
              id="password"
              className="w-[440px] px-3 py-4 border rounded-md focus:ring-2 focus:ring-[#252E66] focus:outline-none"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#252E66] text-white py-3 rounded-md font-semibold hover:bg-[#1F2557]"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

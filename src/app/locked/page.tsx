"use client";
import { useState, useEffect } from "react";

export default function LockedPage() {
  const [timeLeft, setTimeLeft] = useState(300); // 5분 = 300초

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#252E66]/80">
      {/* 헤더 */}
      <header className="absolute top-0 w-full bg-white py-4 shadow-sm">
        <div className="w-full flex items-center justify-between px-6">
          {/* 로고 */}
          <img src="/loginLogo.png" className="w-32" />
          {/* 타이머 및 로그인 버튼 */}
          <div className="flex items-center ml-auto">
            
            <a
              href="#"
              className="px-4 py-2 bg-[#252E66] text-white text-sm font-semibold rounded-md hover:bg-[#1F2557]"
            >
              로그인
            </a>
          </div>
        </div>
      </header>

      {/* 로그인 박스 */}
      <div className="bg-white rounded-lg shadow-md px-20 pb-14 pt-20">
        <h2 className="w-[440px] text-3xl font-bold mb-2 text-[#FF0000]">
          계정이 잠긴 상태입니다.
        </h2>

        <p className="w-[440px] text-sm text-gray-600 mb-6">
          잘못된 비밀번호를 5회 이상 입력하셨습니다. 5분 후에 다시 시도해주세요.
        </p>

        <div className="mb-4 h-24"></div>
        <div className="text-md font-semibold mb-1 text-right">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
        <button
          type="submit"
          className="w-full bg-[#252E66] text-white py-3 rounded-md font-semibold hover:bg-[#1F2557]"
        >
          로그인
        </button>
      </div>
    </div>
  );
}

"use client";

export default function PasswordChangeModalPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#252E66]/80">
      {/* 헤더 */}
      <header className="absolute top-0 w-full bg-white py-4 shadow-sm">
        <div className="w-full flex items-center justify-between px-6">
          {/* 로고 */}
          <img src="/loginLogo.png" className="w-32" />
          {/* 로그인 버튼 */}
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
        <h2 className="text-3xl font-bold mb-2">비밀번호 변경</h2>

        <p className="w-[440px] text-sm text-gray-600 mb-6 break-words">
          최초 로그인 시 비밀번호 변경이 필요합니다! 미 변경시 시스템을 사용할 수 없습니다. 비밀번호를 변경해주세요!.
        </p>

        <div className="mb-4 h-24 w-[440px] opacity-0 pointer-events-none">
        </div>

        <button
          type="submit"
          className="w-[440px] bg-[#252E66] text-white py-3 rounded-md font-semibold hover:bg-[#1F2557]"
        >
          변경하기
        </button>
      </div>
    </div>
  );
}

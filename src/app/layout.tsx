"use client";
import { usePathname } from "next/navigation"; // 수정된 import
import Link from "next/link";
import "./globals.css";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // 현재 경로 가져오기
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false); // 상태 관리

  const toggleStatistics = () => {
    setIsStatisticsOpen((prev) => !prev); // 열고 닫기 토글
  };
  // 경로에 따라 표시할 이름 설정
  const pageTitle = (() => {
    if (pathname === "/user/home") {
      return "홈";
    } else if (pathname.startsWith("/user/myticket")) {
      return "티켓 조회";
    } else if (pathname === "/user/createticket") {
      return "티켓 생성";
    } else if (pathname === "/user/mypage") {
      return "계정";
    } else if (pathname.startsWith("/manager/monitoring")) {
      return "통계";
    } else {
      return "페이지 없음";
    }
  })();

  return (
    <html lang="en">
      <body className="h-screen flex">
        {/* 사이드바 */}
        <aside className="w-64 h-screen bg-[#252E66] text-white flex flex-col justify-between">
          {/* 상단 사용자 정보 */}
          <div>
            <div className="flex items-center space-x-2 mt-6 ml-10">
              <img
                src="/userProfileImage.png"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white font-inter text-base font-semibold leading-normal">
                사용자 이름
              </span>
            </div>

            {/* 사용자 네비게이션 메뉴 */}
            <nav className="mt-6 w-full">
              <ul className="space-y-3 w-full">
                <li className="ml-3 mr-3">
                  <Link
                    href="/user/home"
                    className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname === "/user/home" ? "bg-[#FFFFFF]/20" : ""
                      }`}
                  >
                    <img
                      src="/home.png"
                      alt="Home Icon"
                      className="ml-4 w-6 h-6 rounded-full"
                    />
                    <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                      홈
                    </span>
                  </Link>
                </li>
                <li className="ml-3 mr-3">
                  <Link
                    href="/user/createticket"
                    className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname === "/user/createticket" ? "bg-[#FFFFFF]/20" : ""
                      }`}
                  >
                    <img
                      src="/create_ticket.png"
                      alt="Create Ticket Icon"
                      className="ml-4 w-6 h-6 rounded-full"
                    />
                    <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                      티켓 생성
                    </span>
                  </Link>
                </li>
                <li className="ml-3 mr-3">
                  <Link
                    href="/user/myticket"
                    className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname.startsWith("/user/myticket") ? "bg-[#FFFFFF]/20" : ""
                      }`}
                  >
                    <img
                      src="/manage_ticket.png"
                      alt="Manage Ticket Icon"
                      className="ml-4 w-6 h-6 rounded-full"
                    />
                    <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                      티켓 조회
                    </span>
                  </Link>
                </li>
                <li className="ml-3 mr-3">
                  <Link
                    href="/user/mypage"
                    className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname === "/user/mypage" ? "bg-[#FFFFFF]/20" : ""
                      }`}
                  >
                    <img
                      src="/mypage.png"
                      alt="My Page Icon"
                      className="ml-4 w-6 h-6 rounded-full"
                    />
                    <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                      계정
                    </span>
                  </Link>
                </li>

                {/* 담당자 사이드바 */}
                {/* 통계 탭 */}
                <li className="ml-3 mr-3">
                  <div
                    onClick={toggleStatistics}
                    className={`cursor-pointer flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20`}
                  >
                    <img
                      src="/statistic.png"
                      alt="Statistics Icon"
                      className="ml-4 w-6 h-6 rounded-full"
                    />
                    <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                      통계
                    </span>
                  </div>

                  {/* 하위 리스트 */}
                  <ul
                    className={`ml-10 mt-2 space-y-2 transition-all duration-300 overflow-hidden ${isStatisticsOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    style={{ transitionTimingFunction: "ease-in-out" }}
                  >
                    <li>
                      <Link
                        href="/manager/monitoring/daily"
                        className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname === "/manager/monitoring/daily"
                            ? "bg-[#FFFFFF]/20"
                            : ""
                          }`}
                      >
                        <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                          일간 모니터링
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/manager/monitoring/monthly"
                        className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname === "/manager/monitoring/monthly"
                            ? "bg-[#FFFFFF]/20"
                            : ""
                          }`}
                      >
                        <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                          월간 모니터링
                        </span>
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>

          {/* 하단 브랜드명 */}
          <div className="mb-5 flex justify-center">
            <img src="/logo.png" className="w-28 h-auto" alt="Brand Logo" />
          </div>
        </aside>

        {/* 메인 컨테이너 */}
        <div className="flex-1 flex flex-col">
          {/* 헤더바 */}
          <header
            className="text-black p-6 flex justify-between items-center border-b"
            style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
          >
            <div className="ml-4">{pageTitle}</div>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <img src="/bell_remind.png" className="w-5" />
                </li>
                <li>
                  <img src="/ticket_remind.png" className="w-5" />
                </li>
                <li>로그아웃</li>
              </ul>
            </nav>
          </header>

          {/* 메인 콘텐츠 */}
          <main className="flex-1 p-6 overflow-y-auto bg-white">{children}</main>
        </div>
      </body>
    </html>
  );
}

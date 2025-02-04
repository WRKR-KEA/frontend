"use client";
import { usePathname } from "next/navigation"; // 수정된 import
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import path from "path";

interface User {
    id: string;
    name: string;
    email: string;
    role: string; // "USER", "MANAGER", "ADMIN" 등 역할 추가 가능
}

interface SidebarProps {
    user: User | null; // ✅ user를 props로 받음 (null일 수도 있음)
}

export default function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname(); // 현재 경로 가져오기
    const [isTicketManagementOpen, setIsTicketManagementOpen] = useState(false);
    const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);
    const [isMemberManagement, setIsMemberManagement] = useState(false)
    const [activeModal, setActiveModal] = useState<null | string>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 사이드바 상태 관리

    const router = useRouter();

    // 사이드바 열고 닫기 함수
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };
    const toggleModal = (modalType: string) => {
        setActiveModal((prev) => (prev === modalType ? null : modalType));
    };


    const excludedPaths = ["/login", "/changepassword", "/locked", "/passwordchangemodal"];
    const isLoginPage = excludedPaths.includes(pathname);

    const toggleTicketManagement = () => {
        setIsTicketManagementOpen((prev) => !prev);
    };

    const toggleStatistics = () => {
        setIsStatisticsOpen((prev) => !prev);
    };

    const toggleMembermanagement = () => {
        setIsMemberManagement((prev) => !prev);
    };


    return (
        <aside
            className={`h-screen bg-[#252E66] text-white flex flex-col justify-between transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0"
                }`}
            style={{
                overflow: isSidebarOpen ? "visible" : "hidden", // 닫힐 때 overflow 처리
            }}
        >
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
                    {user?.role === "USER" && (
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
                                    prefetch
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
                                    prefetch
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
                                    prefetch
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
                        </ul>)}



                    {/* 담당자 사이드바 */}

                    {user?.role === "MANAGER" && (
                        <ul className="space-y-3 w-full">
                            <li className="ml-3 mr-3">
                                <Link
                                    href="/manager/home"
                                    className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname === "/manager/home" ? "bg-[#FFFFFF]/20" : ""
                                        }`}
                                    prefetch
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

                            {/* 통계 탭 */}


                            <li className="ml-3 mr-3">
                                <div
                                    onClick={toggleTicketManagement}
                                    className="cursor-pointer flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20"
                                >
                                    <img
                                        src="/manage_ticket.png"
                                        alt="Manage Ticket Icon"
                                        className="ml-4 w-6 h-6"
                                    />
                                    <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                        티켓 관리
                                    </span>
                                </div>
                                <ul
                                    className={`ml-10 space-y-2 transition-all duration-300 overflow-hidden ${isTicketManagementOpen ? "max-h-40 opacity-100" : "max-h-0"
                                        }`}
                                    style={{ transitionTimingFunction: "ease-in-out" }}
                                >
                                    <li>
                                        <Link
                                            href="/manager/myticket"
                                            className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname === "/manager/myticket" ? "bg-[#FFFFFF]/20" : ""
                                                }`}
                                            prefetch
                                        >
                                            <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                                담당 티켓 조회
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/manager/departmentticket"
                                            className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname === "/manager/departmentticket" ? "bg-[#FFFFFF]/20" : ""
                                                }`}
                                            prefetch
                                        >
                                            <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                                부서 티켓 조회
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>






                            <li className="ml-3 mr-3">
                                <Link
                                    href="/manager/managerlist"
                                    className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname === "/manager/managerlist" ? "bg-[#FFFFFF]/20" : ""
                                        }`}
                                    prefetch
                                >
                                    <img
                                        src="/memberlist.png"
                                        alt="Home Icon"
                                        className="ml-4 w-6 h-6"
                                    />
                                    <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                        담당자 조회
                                    </span>
                                </Link>
                            </li>



                            <li className="ml-3 mr-3">
                                <div
                                    onClick={toggleStatistics}
                                    className="cursor-pointer flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20"
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
                                <ul
                                    className={`ml-10 space-y-2 transition-all duration-300 overflow-hidden ${isStatisticsOpen ? "max-h-40 opacity-100" : "max-h-0"
                                        }`}
                                    style={{ transitionTimingFunction: "ease-in-out" }}
                                >
                                    <li>
                                        <Link
                                            href="/manager/monitoring/daily"
                                            className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname === "/manager/monitoring/daily" ? "bg-[#FFFFFF]/20" : ""
                                                }`}
                                            prefetch
                                        >
                                            <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                                일간 모니터링
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/manager/monitoring/monthly"
                                            className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname === "/manager/monitoring/monthly" ? "bg-[#FFFFFF]/20" : ""
                                                }`}
                                            prefetch
                                        >
                                            <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                                월간 모니터링
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="ml-3 mr-3">
                                <Link
                                    href="/manager/mypage"
                                    className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname === "/manager/mypage" ? "bg-[#FFFFFF]/20" : ""
                                        }`}
                                    prefetch
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
                        </ul>)}



                    {/* 관리자 사이드바 */}
                    {user?.role === "ADMIN" && (
                        <ul className="space-y-3 w-full">
                            <li className="ml-3 mr-3">
                                <div
                                    onClick={toggleMembermanagement}
                                    className="cursor-pointer flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20"
                                >
                                    <img
                                        src="/memberlist.png"
                                        alt="Statistics Icon"
                                        className="ml-4 w-6 h-6"
                                    />
                                    <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                        회원 관리
                                    </span>
                                </div>
                                <ul
                                    className={`ml-10 space-y-2 transition-all duration-300 overflow-hidden ${isMemberManagement ? "max-h-40 opacity-100" : "max-h-0"
                                        }`}
                                    style={{ transitionTimingFunction: "ease-in-out" }}
                                >
                                    <li>
                                        <Link
                                            href="/administer/memberlist"
                                            className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname === "/administer/memberlist" ? "bg-[#FFFFFF]/20" : ""
                                                }`}
                                            prefetch
                                        >
                                            <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                                회원 조회
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/administer/memberenrollment"
                                            className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname === "/administer/memberenrollment" ? "bg-[#FFFFFF]/20" : ""
                                                }`}
                                            prefetch
                                        >
                                            <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                                회원 등록
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            <li className="ml-3 mr-3">
                                <Link
                                    href="/administer/categorymanagement"
                                    className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname === "/administer/categorymanagement" ? "bg-[#FFFFFF]/20" : ""
                                        }`}
                                    prefetch
                                >
                                    <img
                                        src="/category.png"
                                        alt="My Page Icon"
                                        className="ml-4 w-6 h-6"
                                    />
                                    <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                        카테고리 조회
                                    </span>
                                </Link>
                            </li>


                            <li className="ml-3 mr-3">
                                <Link
                                    href="/administer/log"
                                    className={`flex space-x-3 px-4 py-2 rounded hover:bg-[#FFFFFF]/20 ${pathname === "/administer/log" ? "bg-[#FFFFFF]/20" : ""
                                        }`}
                                    prefetch
                                >
                                    <img
                                        src="/log.png"
                                        alt="My Page Icon"
                                        className="ml-4 w-6 h-6"
                                    />
                                    <span className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                        로그 조회
                                    </span>
                                </Link>
                            </li>

                        </ul>)}
                </nav>
            </div>

            {/* 하단 브랜드명 */}
            <div className="mb-5 flex justify-center">
                <img src="/logo.png" className="w-28 h-auto" alt="Brand Logo" />
            </div>
        </aside>
    );
}
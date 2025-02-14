"use client";
import { usePathname } from "next/navigation"; // 수정된 import
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import path from "path";

interface User {
    id: string;
    name: string;
    profileImage: string;
    role: string; // "USER", "MANAGER", "ADMIN" 등 역할 추가 가능
    nickname: string;
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

    const handleLogoClick = () => {
        if (user.role === "USER") {
            router.push("/user/home");
        } else if (user.role === "MANAGER") {
            router.push("/manager/home");
        } else if (user.role === "ADMIN") {
            router.push("/administer/memberlist");
        }
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
            className={`h-screen bg-main-1 text-white flex flex-col justify-between transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-52 min-w-52 opacity-100" : "w-0 opacity-0"
                }`}
            style={{
                overflow: isSidebarOpen ? "visible" : "hidden", // 닫힐 때 overflow 처리
            }}
        >
            {/* 상단 사용자 정보 */}
            <div>
                <div className="flex items-center space-x-2 mt-6 ml-10">
                    <img
                        src={user?.profileImage || "/profile.png"}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full"
                    />

                    <span className="text-white font-inter text-base font-semibold leading-normal">
                        {user?.name}
                    </span>
                </div>

                <hr className="border-main-3 mt-4 mx-3"/>

                {/* 사용자 네비게이션 메뉴 */}
                <nav className="mt-4 w-full">
                    {user?.role === "USER" && (
                        <ul className="space-y-3 w-full">

                            <li className="ml-3 mr-3">
                                <Link
                                    href="/user/home"
                                    className={`flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20 ${pathname === "/user/home" ? "bg-[#FFFFFF]/20" : ""
                                        }`}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-4">
                                        <path
                                            d="M19.7499 10C19.7499 9.80108 19.6709 9.61032 19.5302 9.46967C19.3896 9.32901 19.1988 9.25 18.9999 9.25C18.801 9.25 18.6102 9.32901 18.4696 9.46967C18.3289 9.61032 18.2499 9.80108 18.2499 10H19.7499ZM5.74991 10C5.74991 9.80108 5.67089 9.61032 5.53024 9.46967C5.38959 9.32901 5.19882 9.25 4.99991 9.25C4.801 9.25 4.61023 9.32901 4.46958 9.46967C4.32893 9.61032 4.24991 9.80108 4.24991 10H5.74991ZM20.4699 12.53C20.5386 12.6037 20.6214 12.6628 20.7134 12.7038C20.8054 12.7448 20.9047 12.7668 21.0054 12.7686C21.1061 12.7704 21.2061 12.7518 21.2995 12.7141C21.3929 12.6764 21.4777 12.6203 21.5489 12.549C21.6202 12.4778 21.6763 12.393 21.714 12.2996C21.7518 12.2062 21.7703 12.1062 21.7685 12.0055C21.7667 11.9048 21.7447 11.8055 21.7037 11.7135C21.6627 11.6215 21.6036 11.5387 21.5299 11.47L20.4699 12.53ZM11.9999 3L12.5299 2.47C12.3893 2.32955 12.1987 2.25066 11.9999 2.25066C11.8012 2.25066 11.6105 2.32955 11.4699 2.47L11.9999 3ZM2.46991 11.47C2.39622 11.5387 2.33712 11.6215 2.29613 11.7135C2.25514 11.8055 2.23309 11.9048 2.23132 12.0055C2.22954 12.1062 2.24807 12.2062 2.28579 12.2996C2.32351 12.393 2.37965 12.4778 2.45087 12.549C2.52209 12.6203 2.60692 12.6764 2.70031 12.7141C2.7937 12.7518 2.89373 12.7704 2.99443 12.7686C3.09513 12.7668 3.19445 12.7448 3.28645 12.7038C3.37845 12.6628 3.46125 12.6037 3.52991 12.53L2.46991 11.47ZM6.99991 21.75H16.9999V20.25H6.99991V21.75ZM19.7499 19V10H18.2499V19H19.7499ZM5.74991 19V10H4.24991V19H5.74991ZM21.5299 11.47L12.5299 2.47L11.4699 3.53L20.4699 12.53L21.5299 11.47ZM11.4699 2.47L2.46991 11.47L3.52991 12.53L12.5299 3.53L11.4699 2.47ZM16.9999 21.75C17.7293 21.75 18.4287 21.4603 18.9445 20.9445C19.4602 20.4288 19.7499 19.7293 19.7499 19H18.2499C18.2499 19.69 17.6899 20.25 16.9999 20.25V21.75ZM6.99991 20.25C6.30991 20.25 5.74991 19.69 5.74991 19H4.24991C4.24991 19.7293 4.53964 20.4288 5.05537 20.9445C5.57109 21.4603 6.27056 21.75 6.99991 21.75V20.25Z"
                                            fill="white"/>
                                    </svg>
                                    <span
                                        className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                        홈
                                    </span>
                                </Link>
                            </li>
                            <li className="ml-3 mr-3">
                                <Link
                                    href="/user/createticket"
                                    className={`flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20 ${pathname === "/user/createticket" ? "bg-[#FFFFFF]/20" : ""
                                    }`}
                                    prefetch
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-4">
                                        <path
                                            d="M22 13V12C22 8.229 22 6.343 20.828 5.172C19.656 4.001 17.771 4 14 4H10C6.229 4 4.343 4 3.172 5.172C2.001 6.344 2 8.229 2 12C2 15.771 2 17.657 3.172 18.828C4.344 19.999 6.229 20 10 20H13"
                                            stroke="white" strokeWidth="1.5"
                                            strokeLinecap="round"/>
                                        <path opacity="0.4" d="M10 16H6M2 10H22" stroke="white"
                                              strokeWidth="1.5" strokeLinecap="round"/>
                                        <path
                                            d="M15.2727 17.4545H18.5454M18.5454 17.4545H21.8182M18.5454 17.4545V20.7272M18.5454 17.4545V14.1818"
                                            stroke="white" strokeWidth="1.5"
                                            strokeLinecap="round"/>
                                    </svg>
                                    <span
                                        className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                        티켓 요청
                                    </span>
                                </Link>
                            </li>
                            <li className="ml-3 mr-3">
                                <Link
                                    href="/user/myticket"
                                    className={`flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20 ${pathname.startsWith("/user/myticket") ? "bg-[#FFFFFF]/20" : ""
                                    }`}
                                    prefetch
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-4">
                                        <path
                                            d="M22 13V12C22 8.229 22 6.343 20.828 5.172C19.656 4.001 17.771 4 14 4H10C6.229 4 4.343 4 3.172 5.172C2.001 6.344 2 8.229 2 12C2 15.771 2 17.657 3.172 18.828C4.344 19.999 6.229 20 10 20H13"
                                            stroke="white" strokeWidth="1.5"
                                            strokeLinecap="round"/>
                                        <path opacity="0.4" d="M10 16H6M2 10H22" stroke="white"
                                              strokeWidth="1.5" strokeLinecap="round"/>
                                        <path
                                            d="M18 20C19.6569 20 21 18.6569 21 17C21 15.3431 19.6569 14 18 14C16.3431 14 15 15.3431 15 17C15 18.6569 16.3431 20 18 20Z"
                                            stroke="white" strokeWidth="1.5"/>
                                        <path d="M20.5 19.5L21.5 20.5" stroke="white"
                                              strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                    <span
                                        className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                        티켓 조회
                                    </span>
                                </Link>
                            </li>
                            <li className="ml-3 mr-3">
                                <Link
                                    href="/user/mypage"
                                    className={`flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20 ${pathname === "/user/mypage" ? "bg-[#FFFFFF]/20" : ""
                                    }`}
                                    prefetch
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-4">
                                        <path
                                            d="M9 10C11.2091 10 13 8.20914 13 6C13 3.79086 11.2091 2 9 2C6.79086 2 5 3.79086 5 6C5 8.20914 6.79086 10 9 10Z"
                                            stroke="white" strokeWidth="1.5"/>
                                        <path opacity="0.5"
                                              d="M12.5 4.341C12.8564 3.8041 13.3761 3.39621 13.9823 3.17772C14.5886 2.95922 15.249 2.94173 15.866 3.12784C16.4829 3.31394 17.0235 3.69375 17.4078 4.21104C17.7921 4.72833 17.9995 5.3556 17.9995 6C17.9995 6.6444 17.7921 7.27167 17.4078 7.78896C17.0235 8.30625 16.4829 8.68606 15.866 8.87216C15.249 9.05827 14.5886 9.04078 13.9823 8.82228C13.3761 8.60379 12.8564 8.1959 12.5 7.659"
                                              stroke="white" strokeWidth="1.5"/>
                                        <path
                                            d="M9 21C12.866 21 16 19.2091 16 17C16 14.7909 12.866 13 9 13C5.13401 13 2 14.7909 2 17C2 19.2091 5.13401 21 9 21Z"
                                            stroke="white" strokeWidth="1.5"/>
                                        <path opacity="0.5"
                                              d="M18 14C19.754 14.385 21 15.359 21 16.5C21 17.53 19.986 18.423 18.5 18.87"
                                              stroke="white" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                    </svg>
                                    <span
                                        className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
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
                                    className={`flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20 ${pathname === "/manager/home" ? "bg-[#FFFFFF]/20" : ""
                                    }`}
                                    prefetch
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-4">
                                        <path
                                            d="M19.7499 10C19.7499 9.80108 19.6709 9.61032 19.5302 9.46967C19.3896 9.32901 19.1988 9.25 18.9999 9.25C18.801 9.25 18.6102 9.32901 18.4696 9.46967C18.3289 9.61032 18.2499 9.80108 18.2499 10H19.7499ZM5.74991 10C5.74991 9.80108 5.67089 9.61032 5.53024 9.46967C5.38959 9.32901 5.19882 9.25 4.99991 9.25C4.801 9.25 4.61023 9.32901 4.46958 9.46967C4.32893 9.61032 4.24991 9.80108 4.24991 10H5.74991ZM20.4699 12.53C20.5386 12.6037 20.6214 12.6628 20.7134 12.7038C20.8054 12.7448 20.9047 12.7668 21.0054 12.7686C21.1061 12.7704 21.2061 12.7518 21.2995 12.7141C21.3929 12.6764 21.4777 12.6203 21.5489 12.549C21.6202 12.4778 21.6763 12.393 21.714 12.2996C21.7518 12.2062 21.7703 12.1062 21.7685 12.0055C21.7667 11.9048 21.7447 11.8055 21.7037 11.7135C21.6627 11.6215 21.6036 11.5387 21.5299 11.47L20.4699 12.53ZM11.9999 3L12.5299 2.47C12.3893 2.32955 12.1987 2.25066 11.9999 2.25066C11.8012 2.25066 11.6105 2.32955 11.4699 2.47L11.9999 3ZM2.46991 11.47C2.39622 11.5387 2.33712 11.6215 2.29613 11.7135C2.25514 11.8055 2.23309 11.9048 2.23132 12.0055C2.22954 12.1062 2.24807 12.2062 2.28579 12.2996C2.32351 12.393 2.37965 12.4778 2.45087 12.549C2.52209 12.6203 2.60692 12.6764 2.70031 12.7141C2.7937 12.7518 2.89373 12.7704 2.99443 12.7686C3.09513 12.7668 3.19445 12.7448 3.28645 12.7038C3.37845 12.6628 3.46125 12.6037 3.52991 12.53L2.46991 11.47ZM6.99991 21.75H16.9999V20.25H6.99991V21.75ZM19.7499 19V10H18.2499V19H19.7499ZM5.74991 19V10H4.24991V19H5.74991ZM21.5299 11.47L12.5299 2.47L11.4699 3.53L20.4699 12.53L21.5299 11.47ZM11.4699 2.47L2.46991 11.47L3.52991 12.53L12.5299 3.53L11.4699 2.47ZM16.9999 21.75C17.7293 21.75 18.4287 21.4603 18.9445 20.9445C19.4602 20.4288 19.7499 19.7293 19.7499 19H18.2499C18.2499 19.69 17.6899 20.25 16.9999 20.25V21.75ZM6.99991 20.25C6.30991 20.25 5.74991 19.69 5.74991 19H4.24991C4.24991 19.7293 4.53964 20.4288 5.05537 20.9445C5.57109 21.4603 6.27056 21.75 6.99991 21.75V20.25Z"
                                            fill="white"/>
                                    </svg>
                                    <span
                                        className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                        홈
                                    </span>
                                </Link>
                            </li>

                            {/* 통계 탭 */}


                            <li className="ml-3 mr-3">
                                <div
                                    onClick={toggleTicketManagement}
                                    className="cursor-pointer flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-4">
                                        <path
                                            d="M2 12C2 8.229 2 6.343 3.172 5.172C4.344 4.001 6.229 4 10 4H14C17.771 4 19.657 4 20.828 5.172C21.999 6.344 22 8.229 22 12C22 15.771 22 17.657 20.828 18.828C19.656 19.999 17.771 20 14 20H10C6.229 20 4.343 20 3.172 18.828C2.001 17.656 2 15.771 2 12Z"
                                            stroke="white" strokeWidth="1.5"/>
                                        <path opacity="0.5" d="M10 16H6M14 16H12.5M2 10H22"
                                              stroke="white" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                    </svg>
                                    <span
                                        className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                        티켓 관리
                                    </span>
                                </div>
                                <ul
                                    className={`space-y-2 transition-all duration-300 overflow-hidden ${isTicketManagementOpen ? "mt-2 max-h-40 opacity-100" : "max-h-0"
                                    }`}
                                    style={{transitionTimingFunction: "ease-in-out"}}
                                >
                                    <li>
                                        <Link
                                            href="/manager/myticket"
                                            className={`flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20 ${pathname === "/manager/myticket" ? "bg-[#FFFFFF]/20" : ""
                                            }`}
                                            prefetch
                                        >
                                            <span className="ml-10 mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                                담당 티켓
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/manager/departmentticket"
                                            className={`flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20 ${pathname === "/manager/departmentticket" ? "bg-[#FFFFFF]/20" : ""
                                                }`}
                                            prefetch
                                        >
                                            <span className="ml-10 mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                                부서 티켓
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>






                            <li className="ml-3 mr-3">
                                <Link
                                    href="/manager/managerlist"
                                    className={`flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20 ${pathname === "/manager/managerlist" ? "bg-[#FFFFFF]/20" : ""
                                        }`}
                                    prefetch
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-4">
                                        <path
                                            d="M9 11C10.1046 11 11 10.1046 11 9C11 7.89543 10.1046 7 9 7C7.89543 7 7 7.89543 7 9C7 10.1046 7.89543 11 9 11Z"
                                            stroke="white" strokeWidth="1.5"/>
                                        <path
                                            d="M13 15C13 16.105 13 17 9 17C5 17 5 16.105 5 15C5 13.895 6.79 13 9 13C11.21 13 13 13.895 13 15Z"
                                            stroke="white" strokeWidth="1.5"/>
                                        <path opacity="0.5"
                                              d="M2 12C2 8.229 2 6.343 3.172 5.172C4.344 4.001 6.229 4 10 4H14C17.771 4 19.657 4 20.828 5.172C21.999 6.344 22 8.229 22 12C22 15.771 22 17.657 20.828 18.828C19.656 19.999 17.771 20 14 20H10C6.229 20 4.343 20 3.172 18.828C2.001 17.656 2 15.771 2 12Z"
                                              stroke="white" strokeWidth="1.5"/>
                                        <path d="M19 12H15M19 9H14" stroke="white"
                                              strokeWidth="1.5" strokeLinecap="round"/>
                                        <path opacity="0.9" d="M19 15H16" stroke="white"
                                              strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                    <span
                                        className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                        담당자 조회
                                    </span>
                                </Link>
                            </li>

                            <li className="ml-3 mr-3">
                                <div
                                    onClick={toggleStatistics}
                                    className="cursor-pointer flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-4">
                                        <path opacity="0.5"
                                              d="M2 12C2 7.286 2 4.929 3.464 3.464C4.93 2 7.286 2 12 2C16.714 2 19.071 2 20.535 3.464C22 4.93 22 7.286 22 12C22 16.714 22 19.071 20.535 20.535C19.072 22 16.714 22 12 22C7.286 22 4.929 22 3.464 20.535C2 19.072 2 16.714 2 12Z"
                                              stroke="white" strokeWidth="1.5"/>
                                        <path
                                            d="M7 14L9.293 11.707C9.48053 11.5195 9.73484 11.4142 10 11.4142C10.2652 11.4142 10.5195 11.5195 10.707 11.707L12.293 13.293C12.4805 13.4805 12.7348 13.5858 13 13.5858C13.2652 13.5858 13.5195 13.4805 13.707 13.293L17 10M17 10V12.5M17 10H14.5"
                                            stroke="white" strokeWidth="1.5" strokeLinecap="round"
                                            strokeLinejoin="round"/>
                                    </svg>
                                    <span
                                        className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                        통계
                                    </span>
                                </div>
                                <ul
                                    className={`space-y-2 transition-all duration-300 overflow-hidden ${isStatisticsOpen ? "mt-2 max-h-40 opacity-100" : "max-h-0"
                                    }`}
                                    style={{transitionTimingFunction: "ease-in-out"}}
                                >
                                    <li>
                                        <Link
                                            href="/manager/monitoring/daily"
                                            className={`flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20 ${pathname === "/manager/monitoring/daily" ? "bg-[#FFFFFF]/20" : ""
                                                }`}
                                            prefetch
                                        >
                                            <span className="ml-10 mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                                일간 모니터링
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/manager/monitoring/monthly"
                                            className={`flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20 ${pathname === "/manager/monitoring/monthly" ? "bg-[#FFFFFF]/20" : ""
                                                }`}
                                            prefetch
                                        >
                                            <span className="ml-10 mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                                월간 모니터링
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="ml-3 mr-3">
                                <Link
                                    href="/manager/mypage"
                                    className={`flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20 ${pathname === "/manager/mypage" ? "bg-[#FFFFFF]/20" : ""
                                        }`}
                                    prefetch
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-4">
                                        <path
                                            d="M12 10C14.2091 10 16 8.20914 16 6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6C8 8.20914 9.79086 10 12 10Z"
                                            stroke="white" strokeWidth="1.5"/>
                                        <path
                                            d="M20 17.5C20 19.985 20 22 12 22C4 22 4 19.985 4 17.5C4 15.015 7.582 13 12 13C16.418 13 20 15.015 20 17.5Z"
                                            stroke="white" strokeWidth="1.5"/>
                                    </svg>
                                    <span
                                        className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
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
                                    className="cursor-pointer flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-4">
                                        <path
                                            d="M9 10C11.2091 10 13 8.20914 13 6C13 3.79086 11.2091 2 9 2C6.79086 2 5 3.79086 5 6C5 8.20914 6.79086 10 9 10Z"
                                            stroke="white" strokeWidth="1.5"/>
                                        <path opacity="0.5"
                                              d="M12.5 4.341C12.8564 3.8041 13.3761 3.39621 13.9823 3.17772C14.5886 2.95922 15.249 2.94173 15.866 3.12784C16.4829 3.31394 17.0235 3.69375 17.4078 4.21104C17.7921 4.72833 17.9995 5.3556 17.9995 6C17.9995 6.6444 17.7921 7.27167 17.4078 7.78896C17.0235 8.30625 16.4829 8.68606 15.866 8.87216C15.249 9.05827 14.5886 9.04078 13.9823 8.82228C13.3761 8.60379 12.8564 8.1959 12.5 7.659"
                                              stroke="white" strokeWidth="1.5"/>
                                        <path
                                            d="M9 21C12.866 21 16 19.2091 16 17C16 14.7909 12.866 13 9 13C5.13401 13 2 14.7909 2 17C2 19.2091 5.13401 21 9 21Z"
                                            stroke="white" strokeWidth="1.5"/>
                                        <path opacity="0.5"
                                              d="M18 14C19.754 14.385 21 15.359 21 16.5C21 17.53 19.986 18.423 18.5 18.87"
                                              stroke="white" strokeWidth="1.5"
                                              strokeLinecap="round"/>
                                    </svg>
                                    <span
                                        className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                        회원 관리
                                    </span>
                                </div>
                                <ul
                                    className={`space-y-2 transition-all duration-300 overflow-hidden ${isMemberManagement ? "mt-2 max-h-40 opacity-100" : "max-h-0"
                                    }`}
                                    style={{transitionTimingFunction: "ease-in-out"}}
                                >
                                    <li>
                                        <Link
                                            href="/administer/memberlist"
                                            className={`flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20 ${pathname === "/administer/memberlist" ? "bg-[#FFFFFF]/20" : ""
                                            }`}
                                            prefetch
                                        >
                                            <span className="ml-10 mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                                회원 조회
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/administer/memberenrollment"
                                            className={`flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20 ${pathname === "/administer/memberenrollment" ? "bg-[#FFFFFF]/20" : ""
                                                }`}
                                            prefetch
                                        >
                                            <span className="ml-10 mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                                회원 등록
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            <li className="ml-3 mr-3">
                                <Link
                                    href="/administer/categorymanagement"
                                    className={`flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20 ${pathname === "/administer/categorymanagement" ? "bg-[#FFFFFF]/20" : ""
                                        }`}
                                    prefetch
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-4">
                                        <path
                                            d="M2.5 17.5C2.5 15.614 2.5 14.672 3.086 14.086C3.672 13.5 4.614 13.5 6.5 13.5C8.386 13.5 9.328 13.5 9.914 14.086C10.5 14.672 10.5 15.614 10.5 17.5C10.5 19.386 10.5 20.328 9.914 20.914C9.328 21.5 8.386 21.5 6.5 21.5C4.614 21.5 3.672 21.5 3.086 20.914C2.5 20.328 2.5 19.386 2.5 17.5ZM13.5 6.5C13.5 4.614 13.5 3.672 14.086 3.086C14.672 2.5 15.614 2.5 17.5 2.5C19.386 2.5 20.328 2.5 20.914 3.086C21.5 3.672 21.5 4.614 21.5 6.5C21.5 8.386 21.5 9.328 20.914 9.914C20.328 10.5 19.386 10.5 17.5 10.5C15.614 10.5 14.672 10.5 14.086 9.914C13.5 9.328 13.5 8.386 13.5 6.5Z"
                                            stroke="white" strokeWidth="1.5"/>
                                        <path
                                            d="M2.5 6.5C2.5 5.43913 2.92143 4.42172 3.67157 3.67157C4.42172 2.92143 5.43913 2.5 6.5 2.5C7.56087 2.5 8.57828 2.92143 9.32843 3.67157C10.0786 4.42172 10.5 5.43913 10.5 6.5C10.5 7.56087 10.0786 8.57828 9.32843 9.32843C8.57828 10.0786 7.56087 10.5 6.5 10.5C5.43913 10.5 4.42172 10.0786 3.67157 9.32843C2.92143 8.57828 2.5 7.56087 2.5 6.5Z"
                                            stroke="white" strokeWidth="1.5"/>
                                        <path opacity="0.5"
                                              d="M13.5 17.5C13.5 16.4391 13.9214 15.4217 14.6716 14.6716C15.4217 13.9214 16.4391 13.5 17.5 13.5C18.5609 13.5 19.5783 13.9214 20.3284 14.6716C21.0786 15.4217 21.5 16.4391 21.5 17.5C21.5 18.5609 21.0786 19.5783 20.3284 20.3284C19.5783 21.0786 18.5609 21.5 17.5 21.5C16.4391 21.5 15.4217 21.0786 14.6716 20.3284C13.9214 19.5783 13.5 18.5609 13.5 17.5Z"
                                              stroke="white" strokeWidth="1.5"/>
                                    </svg>
                                    <span
                                        className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                        카테고리 관리
                                    </span>
                                </Link>
                            </li>


                            <li className="ml-3 mr-3">
                                <Link
                                    href="/administer/log"
                                    className={`flex space-x-3 px-4 py-2 rounded-lg hover:bg-[#FFFFFF]/20 ${pathname === "/administer/log" ? "bg-[#FFFFFF]/20" : ""
                                    }`}
                                    prefetch
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-4">
                                        <path
                                            d="M4 12H4.01M4 6H4.01M4 18H4.01M8 18H10M8 12H10M8 6H10M14 6H20M14 12H20M14 18H20"
                                            stroke="white" strokeWidth="1.5" strokeLinecap="round"
                                            strokeLinejoin="round"/>
                                    </svg>
                                    <span
                                        className="mt-0.5 text-white font-inter text-base font-semibold leading-normal">
                                        접속 로그 조회
                                    </span>
                                </Link>
                            </li>

                        </ul>)}
                </nav>
            </div>

            {/* 하단 브랜드명 */}
            <div className="mb-5 flex justify-center cursor-pointer" onClick={handleLogoClick}>
                <svg width="96" height="32" viewBox="0 0 96 32" fill="none">
                    <path
                        d="M88.6667 10.4575V20.8761C88.6667 23.1707 88.085 24.8761 86.9218 25.9924C85.7585 27.1087 84.0678 27.6668 81.8498 27.6668C80.671 27.6668 79.5543 27.5195 78.4995 27.225C77.4603 26.9304 76.584 26.504 75.8705 25.9459L77.313 23.3412C77.8403 23.7754 78.484 24.1164 79.244 24.3645C80.0041 24.6126 80.7718 24.7366 81.5474 24.7366C82.7572 24.7366 83.6413 24.4575 84.1997 23.8994C84.758 23.3412 85.0372 22.4885 85.0372 21.3412V20.9226C84.5719 21.3878 84.0213 21.7443 83.3854 21.9924C82.7494 22.2405 82.067 22.3645 81.338 22.3645C79.6939 22.3645 78.391 21.8994 77.4293 20.9691C76.4677 20.0234 75.9868 18.6126 75.9868 16.7366V10.4575H79.6163V16.2017C79.6163 18.2327 80.4616 19.2482 82.1523 19.2482C83.0209 19.2482 83.7188 18.9691 84.2462 18.411C84.7735 17.8374 85.0372 16.9924 85.0372 15.8761V10.4575H88.6667Z"
                        fill="white"/>
                    <path
                        d="M74.0067 22.3646C73.6499 22.6282 73.2079 22.8297 72.6805 22.9693C72.1687 23.0933 71.6336 23.1553 71.0752 23.1553C69.5707 23.1553 68.4151 22.7755 67.6086 22.0158C66.802 21.2561 66.3988 20.1398 66.3988 18.6669V7.69019H70.0282V10.7367H73.1226V13.5274H70.0282V18.6204C70.0282 19.1475 70.1601 19.5584 70.4238 19.853C70.6874 20.132 71.0674 20.2716 71.5638 20.2716C72.1222 20.2716 72.6185 20.1165 73.0528 19.8065L74.0067 22.3646Z"
                        fill="white"/>
                    <path
                        d="M58.0962 20.248C58.7476 20.248 59.3215 20.155 59.8179 19.9689C60.3297 19.7674 60.8028 19.4573 61.2371 19.0387L63.1681 21.1317C61.9893 22.4805 60.2677 23.155 58.0031 23.155C56.5917 23.155 55.3431 22.8836 54.2573 22.341C53.1716 21.7829 52.334 21.0154 51.7446 20.0387C51.1552 19.0619 50.8605 17.9534 50.8605 16.7131C50.8605 15.4883 51.1475 14.3875 51.7214 13.4108C52.3108 12.4185 53.1096 11.6511 54.1177 11.1084C55.1414 10.5503 56.2892 10.2712 57.5611 10.2712C58.7554 10.2712 59.8411 10.5271 60.8183 11.0387C61.7954 11.5348 62.571 12.2635 63.1449 13.2247C63.7343 14.1705 64.029 15.2945 64.029 16.5968L54.7692 18.3875C55.0329 19.0077 55.4439 19.4728 56.0023 19.7829C56.5762 20.0929 57.2741 20.248 58.0962 20.248ZM57.5611 13.0154C56.646 13.0154 55.9014 13.31 55.3276 13.8991C54.7537 14.4883 54.4512 15.3022 54.4202 16.341L60.5158 15.155C60.3452 14.5038 59.9962 13.9844 59.4689 13.5968C58.9415 13.2092 58.3056 13.0154 57.5611 13.0154Z"
                        fill="white"/>
                    <path
                        d="M42.3518 18.0622L40.6069 19.7831V22.9692H36.9774V5.71338H40.6069V15.4808L45.9115 10.4576H50.2389L45.0274 15.7599L50.7042 22.9692H46.307L42.3518 18.0622Z"
                        fill="white"/>
                    <path
                        d="M29.3715 23.155C28.0376 23.155 26.8355 22.8836 25.7653 22.341C24.7106 21.7829 23.8808 21.0154 23.2759 20.0387C22.6865 19.0619 22.3918 17.9534 22.3918 16.7131C22.3918 15.4728 22.6865 14.3643 23.2759 13.3875C23.8808 12.4108 24.7106 11.6511 25.7653 11.1084C26.8355 10.5503 28.0376 10.2712 29.3715 10.2712C30.6899 10.2712 31.8377 10.5503 32.8148 11.1084C33.8075 11.6511 34.5287 12.434 34.9785 13.4573L32.1634 14.9689C31.5119 13.8216 30.5735 13.248 29.3482 13.248C28.4021 13.248 27.6188 13.5581 26.9984 14.1782C26.378 14.7984 26.0677 15.6433 26.0677 16.7131C26.0677 17.7829 26.378 18.6278 26.9984 19.248C27.6188 19.8681 28.4021 20.1782 29.3482 20.1782C30.5891 20.1782 31.5274 19.6046 32.1634 18.4573L34.9785 19.9922C34.5287 20.9844 33.8075 21.7596 32.8148 22.3178C31.8377 22.8759 30.6899 23.155 29.3715 23.155Z"
                        fill="white"/>
                    <path d="M16.3245 10.4575H19.9539V22.9691H16.3245V10.4575Z" fill="white"/>
                    <path
                        d="M18.1392 8.71326C17.4723 8.71326 16.9294 8.51946 16.5106 8.13187C16.0918 7.74427 15.8824 7.26365 15.8824 6.69C15.8824 6.11636 16.0918 5.63574 16.5106 5.24814C16.9294 4.86055 17.4723 4.66675 18.1392 4.66675C18.8062 4.66675 19.349 4.85279 19.7678 5.22489C20.1866 5.59698 20.396 6.0621 20.396 6.62024C20.396 7.22489 20.1866 7.72876 19.7678 8.13187C19.349 8.51946 18.8062 8.71326 18.1392 8.71326Z"
                        fill="#F4C62E"/>
                    <path
                        d="M14.2746 22.3646C13.9178 22.6282 13.4758 22.8297 12.9484 22.9693C12.4366 23.0933 11.9015 23.1553 11.3431 23.1553C9.83856 23.1553 8.68302 22.7755 7.87648 22.0158C7.06993 21.2561 6.66666 20.1398 6.66666 18.6669V7.69019H10.2961V10.7367H13.3905V13.5274H10.2961V18.6204C10.2961 19.1475 10.428 19.5584 10.6916 19.853C10.9553 20.132 11.3353 20.2716 11.8317 20.2716C12.39 20.2716 12.8864 20.1165 13.3207 19.8065L14.2746 22.3646Z"
                        fill="white"/>
                </svg>
                {/*<img src="/logo.png" className="w-28 h-auto" alt="Brand Logo" />*/}
            </div>
        </aside>
    );
}
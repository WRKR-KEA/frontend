"use client";
import { usePathname } from "next/navigation"; // 수정된 import
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import path from "path";

export default function Headerbar() {
    const pathname = usePathname(); // 현재 경로 가져오기
    const [activeModal, setActiveModal] = useState<null | string>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 사이드바 상태 관리

    // 사이드바 열고 닫기 함수
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };
    const toggleModal = (modalType: string) => {
        setActiveModal((prev) => (prev === modalType ? null : modalType));
    };
    const pageTitle = (() => {
        switch (true) {
            case pathname === "/user/home" || pathname === "/manager/home":
                return "홈";
            case pathname === "/user/createticket":
                return "티켓 생성";
            case pathname.startsWith("/user/myticket"):
                return "티켓 조회";
            case pathname === "/user/mypage" || pathname === "/manager/mypage":
                return "계정";
            case pathname.startsWith("/manager/myticket"):
                return "담당 티켓 조회";
            case pathname.startsWith("/manager/departmentticket"):
                return "부서 티켓 조회";
            case pathname === "/manager/managerlist":
                return "담당자 조회";
            case pathname.startsWith("/manager/monitoring"):
                return "통계";
            case pathname.startsWith("/administer/memberlist"):
                return "회원 조회";
            case pathname === "/administer/memberenrollment":
                return "회원 등록";
            case pathname === "/administer/categorymanagement":
                return "카테고리 조회";
            case pathname === "/administer/log":
                return "로그 조회"
            default:
                return "페이지 없음";
        }
    })();

    return (
        <header
            className="text-black p-6 flex justify-between items-center border-b relative"
            style={{ borderColor: "rgba(0, 0, 0, 0.1)", height: "40px" }}
        >
            <div className="text-[#252E66] font-semibold flex items-center">
                {/* 사이드바 토글 버튼 */}
                <svg className="mr-3 cursor-pointer" onClick={toggleSidebar} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.875 3.75V16.25H3.125C2.95924 16.25 2.80027 16.1842 2.68306 16.0669C2.56585 15.9497 2.5 15.7908 2.5 15.625V4.375C2.5 4.20924 2.56585 4.05027 2.68306 3.93306C2.80027 3.81585 2.95924 3.75 3.125 3.75H6.875Z" fill="black" fillOpacity="0.04" />
                    <path d="M16.875 3.125H3.125C2.79348 3.125 2.47554 3.2567 2.24112 3.49112C2.0067 3.72554 1.875 4.04348 1.875 4.375V15.625C1.875 15.9565 2.0067 16.2745 2.24112 16.5089C2.47554 16.7433 2.79348 16.875 3.125 16.875H16.875C17.2065 16.875 17.5245 16.7433 17.7589 16.5089C17.9933 16.2745 18.125 15.9565 18.125 15.625V4.375C18.125 4.04348 17.9933 3.72554 17.7589 3.49112C17.5245 3.2567 17.2065 3.125 16.875 3.125ZM3.125 11.875H4.375C4.54076 11.875 4.69973 11.8092 4.81694 11.6919C4.93415 11.5747 5 11.4158 5 11.25C5 11.0842 4.93415 10.9253 4.81694 10.8081C4.69973 10.6908 4.54076 10.625 4.375 10.625H3.125V9.375H4.375C4.54076 9.375 4.69973 9.30915 4.81694 9.19194C4.93415 9.07473 5 8.91576 5 8.75C5 8.58424 4.93415 8.42527 4.81694 8.30806C4.69973 8.19085 4.54076 8.125 4.375 8.125H3.125V6.875H4.375C4.54076 6.875 4.69973 6.80915 4.81694 6.69194C4.93415 6.57473 5 6.41576 5 6.25C5 6.08424 4.93415 5.92527 4.81694 5.80806C4.69973 5.69085 4.54076 5.625 4.375 5.625H3.125V4.375H6.25V15.625H3.125V11.875ZM16.875 15.625H7.5V4.375H16.875V15.625Z" fill="black" />
                </svg>

                {pageTitle}
            </div>
            <nav>
                <ul className="flex space-x-4">
                    {/* 알림 아이콘 */}
                    <li className="relative">
                        <img
                            src="/bell_remind.png"
                            className="w-5 cursor-pointer"
                            onClick={() => toggleModal("notification")}
                            alt="알림"
                        />
                        {activeModal === "notification" && (
                            <div className="absolute right-[-23px] top-8 w-80 bg-white border rounded-md shadow-lg p-4 z-10">
                                {/* 말풍선 뾰족한 부분 */}
                                <div className="absolute top-[-10px] right-6 w-4 h-4 bg-white border-t border-l rotate-45 transform origin-center"></div>
                                <p className="text-gray-700 mb-2">Notification</p>
                                {/* 알림 리스트 */}
                                <ul className="space-y-4">
                                    {/* 알림 아이템 1 */}
                                    <li className="flex items-center space-x-3">
                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                                            <img src="/adminProfile.png" alt="알림 아이콘" className="" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-800 font-semibold">새 메시지가 도착했습니다.</p>
                                            <p className="text-xs text-gray-500">10분 전</p>
                                        </div>
                                    </li>
                                    {/* 알림 아이템 2 */}
                                    <li className="flex items-center space-x-3">
                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                                            <img src="/adminProfile.png" alt="알림 아이콘" className="" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-800 font-semibold">작업이 완료되었습니다.</p>
                                            <p className="text-xs text-gray-500">1시간 전</p>
                                        </div>
                                    </li>
                                    {/* 알림 아이템 3 */}
                                    <li className="flex items-center space-x-3">
                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                                            <img src="/adminProfile.png" alt="알림 아이콘" className="" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-800 font-semibold">시스템 점검 및 AS가 완료되었습니다.</p>
                                            <p className="text-xs text-gray-500">2시간 전</p>
                                        </div>
                                    </li>
                                    {/* 알림 아이템 4 */}
                                    <li className="flex items-center space-x-3">
                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                                            <img src="/adminProfile.png" alt="알림 아이콘" className="" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-800 font-semibold">긴급 공지가 있습니다.</p>
                                            <p className="text-xs text-gray-500">어제</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </li>

                    {/* 티켓 알림 아이콘 */}
                    <li className="relative">
                        <img
                            src="/ticket_remind.png"
                            className="w-5 cursor-pointer"
                            onClick={() => toggleModal("ticket")}
                            alt="티켓 알림"
                        />
                        {activeModal === "ticket" && (
                            <div className="absolute right-[-23px] top-8 w-80 bg-white border rounded-md shadow-lg p-4 z-10">
                                {/* 말풍선 뾰족한 부분 */}
                                <div className="absolute top-[-10px] right-6 w-4 h-4 bg-white border-t border-l rotate-45 transform origin-center"></div>
                                <p className="text-gray-700 mb-2">Activities</p>
                                {/* 알림 리스트 */}
                                <ul className="space-y-4">
                                    {/* 알림 아이템 1 */}
                                    <li className="flex items-center space-x-3">
                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                                            <img src="/adminProfile.png" alt="알림 아이콘" className="" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-800 font-semibold">라이언님이 티켓을 발행했습니다.</p>
                                            <p className="text-xs text-gray-500">46분 전</p>
                                        </div>
                                    </li>
                                    {/* 알림 아이템 2 */}
                                    <li className="flex items-center space-x-3">
                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                                            <img src="/adminProfile.png" alt="알림 아이콘" className="" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-800 font-semibold">무지님이 티켓을 발행했습니다.</p>
                                            <p className="text-xs text-gray-500">1시간 전</p>
                                        </div>
                                    </li>
                                    {/* 알림 아이템 3 */}
                                    <li className="flex items-center space-x-3">
                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                                            <img src="/adminProfile.png" alt="알림 아이콘" className="" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-800 font-semibold">어피치님이 티켓 발행을 취소했습니다.</p>
                                            <p className="text-xs text-gray-500">2시간 전</p>
                                        </div>
                                    </li>
                                    {/* 알림 아이템 4 */}

                                </ul>
                            </div>
                        )}
                    </li>
                    {/* 로그아웃 */}
                    <li className="text-[#252E66] text-sm cursor-pointer">로그아웃</li>
                </ul>
            </nav>
        </header>
    );
}
"use client";
import { usePathname, useRouter } from "next/navigation"; // 수정된 import
import { useState } from "react";
import userStore from "@/stores/userStore"; // ✅ zustand 스토어 import

export default function Headerbar() {
    const pathname = usePathname(); // 현재 경로 가져오기
    const [activeModal, setActiveModal] = useState<null | string>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 사이드바 상태 관리
    const router = useRouter(); // ✅ 페이지 이동을 위한 useRouter
    const { setUser } = userStore(); // ✅ zustand에서 setUser 가져오기

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

    // ✅ 로그아웃 처리 함수
    const handleLogout = async () => {
        const accessToken = sessionStorage.getItem("accessToken"); // ✅ accessToken 가져오기

        try {
            if (accessToken) {
                const response = await fetch("http://172.16.211.53:8080/api/auth/logout", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`, 
                    },
                });

                if (!response.ok) {
                    throw new Error(`로그아웃 요청 실패: ${response.statusText}`);
                }
            }
        } catch (error) {
            console.error("로그아웃 요청 중 오류 발생:", error);
        }

        // ✅ 클라이언트 상태 초기화
        setUser(null);
        sessionStorage.removeItem("accessToken"); // ✅ accessToken 삭제
        sessionStorage.removeItem("refreshToken"); // ✅ refreshToken 삭제

        // ✅ 로그인 페이지로 이동
        router.push("/login");
    };


    return (
        <header
            className="text-black p-6 flex justify-between items-center border-b relative"
            style={{ borderColor: "rgba(0, 0, 0, 0.1)", height: "40px" }}
        >
            <div className="text-black font-semibold flex items-center">
                {/* 사이드바 토글 버튼 */}
                <svg className="mr-4 cursor-pointer" onClick={toggleSidebar} width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M22 11C22 7.229 22 5.343 20.828 4.172C19.656 3.001 17.771 3 14 3H10C6.229 3 4.343 3 3.172 4.172C2.001 5.344 2 7.229 2 11V13C2 16.771 2 18.657 3.172 19.828C4.344 20.999 6.229 21 10 21H14C17.771 21 19.657 21 20.828 19.828C21.999 18.656 22 16.771 22 13V11Z"
                        stroke="black" stroke-width="1.5"/>
                    <path d="M18.5 10H12.5M17.5 14H13.5" stroke="black" stroke-width="1.5"
                          stroke-linecap="round"/>
                    <path opacity="0.5" d="M9 21V3" stroke="black" stroke-width="1.5"
                          stroke-linecap="round"/>
                </svg>

                {pageTitle}
            </div>
            <nav>
                <ul className="flex space-x-4">
                    {/* 알림 아이콘 */}
                    <li className="relative">
                        <svg className="cursor-pointer" onClick={() => toggleModal("notification")} width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M20.7927 16.6444C20.2723 15.7481 19.4989 13.2122 19.4989 9.89999C19.4989 7.91087 18.7087 6.00322 17.3022 4.59669C15.8957 3.19017 13.988 2.39999 11.9989 2.39999C10.0098 2.39999 8.10214 3.19017 6.69561 4.59669C5.28909 6.00322 4.49891 7.91087 4.49891 9.89999C4.49891 13.2131 3.72454 15.7481 3.20423 16.6444C3.07135 16.8722 3.00091 17.1311 3.00001 17.3948C2.9991 17.6586 3.06776 17.9179 3.19907 18.1467C3.33037 18.3755 3.51968 18.5656 3.74789 18.6978C3.9761 18.8301 4.23515 18.8998 4.49891 18.9H8.32485C8.49789 19.7467 8.95806 20.5077 9.62754 21.0542C10.297 21.6007 11.1347 21.8992 11.9989 21.8992C12.8631 21.8992 13.7008 21.6007 14.3703 21.0542C15.0398 20.5077 15.4999 19.7467 15.673 18.9H19.4989C19.7626 18.8996 20.0215 18.8298 20.2496 18.6975C20.4777 18.5651 20.6669 18.375 20.7981 18.1463C20.9292 17.9176 20.9978 17.6583 20.9969 17.3946C20.9959 17.1309 20.9255 16.8722 20.7927 16.6444ZM11.9989 20.4C11.5337 20.3999 11.0801 20.2555 10.7003 19.9869C10.3205 19.7183 10.0333 19.3386 9.87829 18.9H14.1195C13.9645 19.3386 13.6773 19.7183 13.2975 19.9869C12.9178 20.2555 12.4641 20.3999 11.9989 20.4ZM4.49891 17.4C5.22079 16.1587 5.99891 13.2825 5.99891 9.89999C5.99891 8.30869 6.63105 6.78257 7.75627 5.65735C8.88149 4.53214 10.4076 3.89999 11.9989 3.89999C13.5902 3.89999 15.1163 4.53214 16.2416 5.65735C17.3668 6.78257 17.9989 8.30869 17.9989 9.89999C17.9989 13.2797 18.7752 16.1559 19.4989 17.4H4.49891Z"
                                fill="black"/>
                        </svg>
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
                        <svg className="cursor-pointer" onClick={() => toggleModal("ticket")} width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M2 12C2 8.229 2 6.343 3.172 5.172C4.344 4.001 6.229 4 10 4H14C17.771 4 19.657 4 20.828 5.172C21.999 6.344 22 8.229 22 12C22 15.771 22 17.657 20.828 18.828C19.656 19.999 17.771 20 14 20H10C6.229 20 4.343 20 3.172 18.828C2.001 17.656 2 15.771 2 12Z"
                                stroke="black" stroke-width="1.5"/>
                            <path opacity="0.5" d="M10 16H6M14 16H12.5M2 10H22" stroke="black"
                                  stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
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
                    {/* ✅ 로그아웃 버튼 (클릭 시 로그아웃 처리) */}
                    <li
                        className="text-black text-md cursor-pointer"
                        onClick={handleLogout} // ✅ 로그아웃 이벤트 적용
                    >
                        로그아웃
                    </li>
                </ul>
            </nav>
        </header>
    );
}
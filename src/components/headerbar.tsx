"use client";
import { usePathname, useRouter } from "next/navigation"; // 수정된 import
import { useState, useEffect, useRef } from "react";
import userStore from "@/stores/userStore"; // ✅ zustand 스토어 import
import api from "@/lib/api/axios";
import PageTitle from "./PageTitle";
import { fetchNotificationCount } from '@/services/user';

export default function Headerbar() {
  const pathname = usePathname(); // 현재 경로 가져오기
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 사이드바 상태 관리
  const router = useRouter(); // ✅ 페이지 이동을 위한 useRouter
  const { user, setUser } = userStore(); // ✅ zustand에서 setUser 가져오기
  const [notificationData, setNotificationData] = useState<any[]>([]); // notificationData 상태 추가
  const [activeModal, setActiveModal] = useState(null);
  const modalRef = useRef(null); // ✅ 모달을 감지하기 위한 ref 추가

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText: "",
    onClose: () => { },
  })

  const showModal = (title: string, btnText = '닫기') => {
    setModalState({
      isOpen: true,
      title,
      btnText,
      onClose: () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  // 사이드바 열고 닫기 함수
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleModal = (modalType: string) => {
    setActiveModal((prev) => (prev === modalType ? null : modalType));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setActiveModal(null);
      }
    };

    if (activeModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeModal]);

  // ✅ 로그아웃 처리 함수
  const handleLogout = async () => {
    const accessToken = sessionStorage.getItem("accessToken"); // ✅ accessToken 가져오기

    try {
      if (accessToken) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`, {
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

  const [notificationCount, setNotificationCount] = useState(0);
  useEffect(() => {
    const getNotificationCount = async () => {
      try {
        const response = await fetchNotificationCount();
        setNotificationCount(response.result); // 서버 응답 값 설정
      } catch (error) {
        showModal("서버와 통신 중 오류가 발생했습니다.");
      }
    };

    getNotificationCount(); // 함수 호출
  }, []);

  // getNotification 함수
  const getNotification = async () => {
    try {
      const response = await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/notifications`);
      let notificationData = response.data.result;
      setNotificationData(notificationData); // notificationData 상태 업데이트
      setNotificationCount(0);
      console.log("ff", response.data.result)
    } catch (error) {
      console.error("알람 에러:", error);
      showModal("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  const notificationIcon = (type: string) => {
    switch (type) {
      case 'TICKET':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="8" fill="var(--main-3)" />
          <path
            d="M5.3335 12.0003C5.3335 9.48633 5.3335 8.22899 6.11483 7.44833C6.89616 6.66766 8.15283 6.66699 10.6668 6.66699H13.3335C15.8475 6.66699 17.1048 6.66699 17.8855 7.44833C18.6662 8.22966 18.6668 9.48633 18.6668 12.0003C18.6668 14.5143 18.6668 15.7717 17.8855 16.5523C17.1042 17.333 15.8475 17.3337 13.3335 17.3337H10.6668C8.15283 17.3337 6.8955 17.3337 6.11483 16.5523C5.33416 15.771 5.3335 14.5143 5.3335 12.0003Z"
            stroke="var(--main-1)" stroke-width="1.5" />
          <path opacity="0.5"
                d="M10.6668 14.667H8.00016M13.3335 14.667H12.3335M5.3335 10.667H18.6668"
                stroke="var(--main-1)" stroke-width="1.5" stroke-linecap="round" />
        </svg>;
      case 'COMMENT':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="8" fill="var(--in-progress-bg)" />
          <g clip-path="url(#clip0_923_32493)">
            <path
              d="M12.0002 18.6663C15.6822 18.6663 18.6668 15.6817 18.6668 11.9997C18.6668 8.31767 15.6822 5.33301 12.0002 5.33301C8.31816 5.33301 5.3335 8.31767 5.3335 11.9997C5.3335 13.0663 5.58416 14.0743 6.02883 14.9683C6.1475 15.2057 6.18683 15.477 6.11816 15.7337L5.7215 17.2177C5.68221 17.3645 5.68225 17.5191 5.7216 17.666C5.76095 17.8128 5.83824 17.9467 5.94571 18.0543C6.05317 18.1618 6.18703 18.2392 6.33385 18.2786C6.48067 18.3181 6.63528 18.3182 6.78216 18.279L8.26616 17.8817C8.52375 17.8166 8.79625 17.8481 9.03216 17.9703C9.95413 18.4294 10.9702 18.6677 12.0002 18.6663Z"
              stroke="var(--in-progress)" stroke-width="1.5" />
            <path opacity="0.5" d="M9.3335 11H14.6668M9.3335 13.3333H13.0002" stroke="var(--in-progress)"
                  stroke-width="1.5" stroke-linecap="round" />
          </g>
          <defs>
            <clipPath id="clip0_923_32493">
              <rect width="16" height="16" fill="white" transform="translate(4 4)" />
            </clipPath>
          </defs>
        </svg>;
      case 'REMIND':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="8" fill="var(--request-bg)" />
          <g clip-path="url(#clip0_923_32494)">
            <path
              d="M12.0002 18.6663C15.6821 18.6663 18.6668 15.6816 18.6668 11.9997C18.6668 8.31778 15.6821 5.33301 12.0002 5.33301C8.31826 5.33301 5.3335 8.31778 5.3335 11.9997C5.3335 15.6816 8.31826 18.6663 12.0002 18.6663Z"
              stroke="var(--request)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 8V12L14.6667 13.3333" stroke="var(--request)" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_923_32494">
              <rect width="16" height="16" fill="white" transform="translate(4 4)" />
            </clipPath>
          </defs>
        </svg>;
    }
  }

  return (
    <header
      className="text-black p-6 flex justify-between items-center border-b relative"
      style={{ borderColor: 'rgba(0, 0, 0, 0.1)', height: '40px' }}
    >
      <PageTitle pathname={pathname} />
      <nav>
        <ul className="flex space-x-4">
          {user?.role !== 'ADMIN' && (
            <>
              <li className="relative">
                <div className="w-6 h-6">
                  {notificationCount > 0 && (
                    <div
                      className="absolute top-[2px] right-[3px] bg-accent-1 text-xs text-white font-bold w-[6px] h-[6px] rounded-full"></div>
                  )}
                  <svg className="cursor-pointer" onClick={() => {
                    toggleModal('notification');
                    getNotification();
                  }} width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20.7927 16.6444C20.2723 15.7481 19.4989 13.2122 19.4989 9.89999C19.4989 7.91087 18.7087 6.00322 17.3022 4.59669C15.8957 3.19017 13.988 2.39999 11.9989 2.39999C10.0098 2.39999 8.10214 3.19017 6.69561 4.59669C5.28909 6.00322 4.49891 7.91087 4.49891 9.89999C4.49891 13.2131 3.72454 15.7481 3.20423 16.6444C3.07135 16.8722 3.00091 17.1311 3.00001 17.3948C2.9991 17.6586 3.06776 17.9179 3.19907 18.1467C3.33037 18.3755 3.51968 18.5656 3.74789 18.6978C3.9761 18.8301 4.23515 18.8998 4.49891 18.9H8.32485C8.49789 19.7467 8.95806 20.5077 9.62754 21.0542C10.297 21.6007 11.1347 21.8992 11.9989 21.8992C12.8631 21.8992 13.7008 21.6007 14.3703 21.0542C15.0398 20.5077 15.4999 19.7467 15.673 18.9H19.4989C19.7626 18.8996 20.0215 18.8298 20.2496 18.6975C20.4777 18.5651 20.6669 18.375 20.7981 18.1463C20.9292 17.9176 20.9978 17.6583 20.9969 17.3946C20.9959 17.1309 20.9255 16.8722 20.7927 16.6444ZM11.9989 20.4C11.5337 20.3999 11.0801 20.2555 10.7003 19.9869C10.3205 19.7183 10.0333 19.3386 9.87829 18.9H14.1195C13.9645 19.3386 13.6773 19.7183 13.2975 19.9869C12.9178 20.2555 12.4641 20.3999 11.9989 20.4ZM4.49891 17.4C5.22079 16.1587 5.99891 13.2825 5.99891 9.89999C5.99891 8.30869 6.63105 6.78257 7.75627 5.65735C8.88149 4.53214 10.4076 3.89999 11.9989 3.89999C13.5902 3.89999 15.1163 4.53214 16.2416 5.65735C17.3668 6.78257 17.9989 8.30869 17.9989 9.89999C17.9989 13.2797 18.7752 16.1559 19.4989 17.4H4.49891Z"
                      fill="black" />
                  </svg>
                </div>
                {activeModal === "notification" && (
                  <div
                    ref={modalRef} // ✅ 모달 ref 추가
                    className="absolute right-[-22px] top-9 w-96 bg-white border rounded-md shadow-lg p-4 z-[100]">
                    {/* 말풍선 뾰족한 부분 */}
                    <div className="absolute top-[-10px] right-6 w-4 h-4 bg-white border-t border-l rotate-45 transform origin-center"></div>
                    <p className="text-gray-700 mb-2">Notification</p>
                    {/* 알림 리스트 */}
                    <ul className="space-y-1 max-h-48 overflow-scroll hide-scrollbar">
                      {/* 알림 아이템 1 */}
                      {notificationData.length > 0 ? (
                        notificationData
                        .map((notification) => (
                          <li
                            key={notification.notificationId}
                            className={`flex items-start space-x-2 ${notification.isRead
                              ? "bg-gray-50 p-3 rounded"
                              : "bg-blue-50 p-3 rounded"
                            }`}
                          >
                            <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full">
                              {notificationIcon(notification.type)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{notification.content}</p>
                              <p className="text-xs text-gray-500">{notification.timeAgo}</p>
                            </div>
                          </li>
                        ))
                      ) : (
                        <div className="text-gray-500 text-sm text-center">알림이 없습니다.</div>
                      )}
                    </ul>

                  </div>
                )}
              </li>
            </> )}

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
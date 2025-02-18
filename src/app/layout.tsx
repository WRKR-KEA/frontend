'use client';
import './globals.css';
import Sidebar from '@/components/sidebar';
import Headerbar from '@/components/headerbar';
import { usePathname, useRouter } from 'next/navigation'; // ✅ useRouter 추가
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import useUserStore from '@/stores/userStore'; // ✅ Zustand 스토어 import
import { useAuthGuard } from '@/hooks/useAuthGuard';
import axios from "axios";

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  const pathname = usePathname(); // 현재 경로 가져오기
  const router = useRouter(); // ✅ useRouter 사용
  const [queryClient] = useState(() => new QueryClient());
  const excludedPaths = [
    "/",
    '/login',
    '/changepassword',
    '/locked',
    '/passwordchangemodal',
    '/reissuepassword',
  ];
  const isExcluded = excludedPaths.includes(pathname);

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText: "",
    onClose:()=>{},
  })

  const showModal = (title: string, btnText='닫기', onCloseCallback?: () => void) => {
      setModalState({
      isOpen: true,
      title,
      btnText,
      onClose: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          if (onCloseCallback) onCloseCallback();
      },

      });
  };
  // ✅ Zustand에서 유저 정보 가져오기
  const user = useUserStore((state) => state.user);
  const { setUser } = useUserStore();

  console.log('현재 로그인된 유저 정보:', user); // ✅ 유저 정보 확인 가능

  const isChecking = useAuthGuard(); // 😎라우트 가드 훅 사용



  const refreshAccessToken = async () => {
    try {
      const refreshToken = sessionStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.warn("리프레시 토큰이 없습니다.");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh`,
        {}, // ✅ POST 요청에 body 없음 (빈 객체 전달)
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`토큰 갱신 실패: ${response.status} - ${response.statusText}`);
      }

      const data = response.data;

      // ✅ Zustand userStore에 로그인 정보 저장
      if (data.result) {
        setUser({
          profileImage: data.result.profileImage,
          name: data.result.name,
          role: data.result.role,
          nickname: data.result.nickname,
        });
        console.log("사용자 정보가 userStore에 저장되었습니다.");
      }

    if (data.result?.accessToken && data.result?.refreshToken) {
      sessionStorage.setItem("accessToken", data.result.accessToken);
      sessionStorage.setItem("refreshToken", data.result.refreshToken);
      console.log("✅ 토큰이 갱신되었습니다.");
    } else {
      console.error("❌ 응답에 토큰이 포함되지 않았습니다.");
    }
  } catch (error) {
    console.error("❌ 토큰 갱신 중 오류 발생:", error);

    if (axios.isAxiosError(error)) {
      console.error("📌 오류 응답 상태 코드:", error.response?.status);
      console.error("📌 오류 메시지:", error.response?.data?.message || "서버 오류 발생");
      console.error("📌 오류 응답 데이터:", error.response?.data);
    } else {
      console.error("📌 예기치 않은 오류:", error);
    }
    showModal("토큰이 유효하지 않습니다. 다시 로그인해주세요", "확인", ()=>{
      router.push("/login")
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
    })
  }
};

 
  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');

    if (!accessToken && pathname!='/reissuepassword' && pathname != "/") {
      router.push('/login');     
    } else {
      refreshAccessToken();
    } 
   
  },[pathname]);

  return (
    <html lang="ko" >
      <head>
        <link rel="icon" href="/favicon.svg" />
        <title>Tickety</title>
      </head>
      <body className="h-screen flex">
        {/* 경로가 제외 대상이 아닌 경우에만 사이드바와 헤더바 표시 */}
        {!isExcluded && <Sidebar user={user} />}

        {/* 메인 컨테이너 */}
        <div className="flex-1 flex flex-col">
          {/* 헤더바 (제외 대상이 아닐 때만 표시) */}
          {!isExcluded && <Headerbar />}

          {/* 메인 콘텐츠 */}
          <main className="flex-1 overflow-y-auto bg-white">
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
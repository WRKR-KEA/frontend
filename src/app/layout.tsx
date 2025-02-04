'use client';
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Headerbar from "@/components/headerbar";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from "react";
import useUserStore from "@/stores/userStore"; // ✅ Zustand 스토어 import

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // 현재 경로 가져오기
  const [queryClient] = useState(() => new QueryClient());
  const excludedPaths = ["/login", "/changepassword", "/locked", "/passwordchangemodal", "/reissuepassword"];
  const isExcluded = excludedPaths.includes(pathname);

  // ✅ Zustand에서 유저 정보 가져오기
  const user = useUserStore((state) => state.user);

  console.log("현재 로그인된 유저 정보:", user); // ✅ 유저 정보 확인 가능

  // 리프레시 토큰 요청 함수
  const refreshAccessToken = async () => {
    try {
      const refreshToken = sessionStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("리프레시 토큰이 없습니다.");
        return;
      }

      const response = await fetch("http://172.16.211.53:8080/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        console.error("토큰 갱신 실패:", response.statusText);
        return;
      }

      const data = await response.json();
      if (data.result?.accessToken && data.result?.refreshToken) {
        sessionStorage.setItem("accessToken", data.result.accessToken);
        sessionStorage.setItem("refreshToken", data.result.refreshToken);
        console.log("토큰이 갱신되었습니다.");
      } else {
        console.error("응답에 토큰이 포함되지 않았습니다.");
      }
    } catch (error) {
      console.error("토큰 갱신 중 오류:", error);
    }
  };

  // ✅ 유저 정보가 있을 때만 토큰 갱신 (로그인된 상태에서만 실행)
  useEffect(() => {
    if (user) {
      refreshAccessToken();
    }
  }, [user]);

  return (
    <html lang="en">
      <body className="h-screen flex">
        {/* 경로가 제외 대상이 아닌 경우에만 사이드바와 헤더바 표시 */}
        {!isExcluded && <Sidebar user={user}/>}

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

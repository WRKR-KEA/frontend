'use client';
import './globals.css';
import Sidebar from '@/components/sidebar';
import Headerbar from '@/components/headerbar';
import { usePathname, useRouter } from 'next/navigation'; // ✅ useRouter 추가
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect, Suspense } from 'react';
import useUserStore from '@/stores/userStore'; // ✅ Zustand 스토어 import
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // 현재 경로 가져오기
  const router = useRouter(); // ✅ useRouter 사용
  const [queryClient] = useState(() => new QueryClient());
  const excludedPaths = [
    '/login',
    '/changepassword',
    '/locked',
    '/passwordchangemodal',
    '/reissuepassword',
  ];
  const isExcluded = excludedPaths.includes(pathname);

  // ✅ Zustand에서 유저 정보 가져오기
  const user = useUserStore((state) => state.user);
  const { setUser } = useUserStore();

  console.log('현재 로그인된 유저 정보:', user); // ✅ 유저 정보 확인 가능

  const isChecking = useAuthGuard(); // 😎라우트 가드 훅 사용

  const refreshAccessToken = async () => {
    try {
      const refreshToken = sessionStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.warn('리프레시 토큰이 없습니다.');
        return;
      }

      const response = await fetch(
        'http://172.16.211.53:8080/api/auth/refresh',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      if (!response.ok) {
        console.error('토큰 갱신 실패:', response.statusText);
        return;
      }

      const data = await response.json();

      // ✅ Zustand userStore에 로그인 정보 저장
      if (data.result) {
        setUser({
          profileImage: data.result.profileImage,
          name: data.result.name,
          role: data.result.role,
        });
        console.log('사용자 정보가 userStore에 저장되었습니다.');
      }

      if (data.result?.accessToken && data.result?.refreshToken) {
        sessionStorage.setItem('accessToken', data.result.accessToken);
        sessionStorage.setItem('refreshToken', data.result.refreshToken);
        console.log('토큰이 갱신되었습니다.');
      } else {
        console.error('응답에 토큰이 포함되지 않았습니다.');
      }
    } catch (error) {
      console.error('토큰 갱신 중 오류:', error);
    }
  };

  // ✅ 유저 정보가 없으면 자동으로 로그인 페이지로 리다이렉트
  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');

    if (!accessToken) {
      router.push('/login'); // ✅ 로그인 페이지로 이동 😎push 대신 replace 사용
    } else {
      refreshAccessToken();
    }
  }, []);

  // 😎로딩 컴포넌트
  const LoadingScreen = () => (
    <div className=" flex items-center justify-center bg-white ">
      Loading...
    </div>
  );

  // 😎권한 체크 중일 때는 아무것도 렌더링하지 않음
  if (isChecking) {
    return (
      <html lang="kr">
        <body>
          <Suspense fallback={<LoadingScreen />}>
            <LoadingScreen />
          </Suspense>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
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
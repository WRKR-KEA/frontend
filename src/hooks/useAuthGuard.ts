import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useUserStore from '@/stores/userStore';

//각 경로별로 허용된 role을 정의하는 인터페이스
interface RouteConfig {
  [key: string]: {
    allowedRoles: string[];
  };
}

// 라우트 허용 경로 설정
const ROUTE_CONFIG: RouteConfig = {
  '/administer': {
    allowedRoles: ['ADMIN'],
  },
  '/manager': {
    allowedRoles: ['MANAGER'],
  },
  '/user': {
    allowedRoles: ['USER'],
  },
};

export const useAuthGuard = () => {
  const router = useRouter();
  const pathname = usePathname(); // 현재 페이지 경로
  const user = useUserStore((state) => state.user);
  const [isChecking, setIsChecking] = useState(true); // 권한 체크 중인지

  // 경로나 user의 정보가 변경될 때마다 체크
  useEffect(() => {
    const checkAuth = () => {
      setIsChecking(true); // 체크 시작할 때 true로 설정

      // 체크가 필요 없는 경로들
      const publicPaths = [
        '/login',
        '/changepassword',
        '/locked',
        '/passwordchangemodal',
        '/reissuepassword',
      ];
      if (publicPaths.includes(pathname)) {
        setIsChecking(false);
        return true; // 접근 허용
      }

      // 현재 URL에서 기본 경로 추출 (/user/profile -> /user)
      const basePath = '/' + pathname.split('/')[1];
      const routeConfig = ROUTE_CONFIG[basePath]; //  경로에 대한 권한 설정을 가져옴

      // 권한 설정이 있고 사용자 정보가 있는 경우
      if (routeConfig && user) {
        if (!routeConfig.allowedRoles.includes(user.role)) {
          // 사용자 정보가 있지만 권한이 없는 경로일 경우 role에 따라 redirect
          const redirectPath =
            user.role === 'ADMIN'
              ? '/administer/memberlist'
              : user.role === 'MANAGER'
                ? '/manager/home'
                : '/user/home';
          // replace를 사용하는 이유는 브라우저 history를 남기지 않기 위해
          router.replace(redirectPath);
          return false;
        }
      }

      setIsChecking(false);
      return true;
    };

    checkAuth();
  }, [pathname, user, router]);

  return isChecking;
};

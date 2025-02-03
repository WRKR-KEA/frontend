'use client'
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Headerbar from "@/components/headerbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // 현재 경로 가져오기

  const excludedPaths = ["/login", "/changepassword", "/locked", "/passwordchangemodal", "/reissuepassword"];
  const isExcluded = excludedPaths.includes(pathname);

  return (
    <html lang="en">
      <body className="h-screen flex">
        {/* 경로가 제외 대상이 아닌 경우에만 사이드바와 헤더바 표시 */}
        {!isExcluded && <Sidebar />}

        {/* 메인 컨테이너 */}
        <div className="flex-1 flex flex-col">
          {/* 헤더바 (제외 대상이 아닐 때만 표시) */}
          {!isExcluded && <Headerbar />}

          {/* 메인 콘텐츠 */}
          <main className="flex-1 overflow-y-auto bg-white">{children}</main>
        </div>
      </body>
    </html>
  );
}

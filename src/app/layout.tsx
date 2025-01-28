import "./globals.css";
import Sidebar from "@/components/sidebar";
import Headerbar from "@/components/headerbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // const pathname = usePathname(); // 현재 경로 가져오기

  


  const excludedPaths = ["/login", "/changepassword", "/locked", "/passwordchangemodal"];
  // const isLoginPage = excludedPaths.includes(pathname);


  

  return (
    <html lang="en">
      <body className="h-screen flex">
      
          <Sidebar />
     

        {/* 메인 컨테이너 */}
        <div className="flex-1 flex flex-col">
          {/* 헤더바 */}
        
            <Headerbar/>
       
          {/* 메인 콘텐츠 */}
          <main className="flex-1 overflow-y-auto bg-white">{children}</main>
        </div>
      </body>
    </html>
  );
}

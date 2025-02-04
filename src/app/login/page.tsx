"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/stores/userStore"
export default function LoginPage() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  // 닉네임 입력 처리
  const handlenicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  // 비밀번호 입력 처리
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nickname === "" || password === "") {
      alert("닉네임과 비밀번호를 입력하세요.");
      return;
    }

    try {
      const response = await fetch("http://172.16.211.53:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "로그인 실패");
        return;
      }

      const data = await response.json();
      console.log("로그인 성공:", data);

      // ✅ 토큰 저장
      if (data.result?.accessToken && data.result?.refreshToken) {
        sessionStorage.setItem("accessToken", data.result.accessToken);
        sessionStorage.setItem("refreshToken", data.result.refreshToken);
        console.log("토큰이 세션스토리지에 저장되었습니다.");
      } else {
        console.error("토큰이 응답에 포함되어 있지 않습니다.");
      }

      // ✅ Zustand userStore에 로그인 정보 저장
      if (data.result) {
        setUser({
          profileImage: data.result.profileImage,
          name: data.result.name,
          role: data.result.role,
        });
        console.log("사용자 정보가 userStore에 저장되었습니다.");
      }

      // 로그인 성공 시 리다이렉트
      alert("로그인 성공!");
      if (data.result.role === "USER") {
        router.push("/user/home");
      }
      else if (data.result.role === "MANAGER") {
        router.push("/manager/home");
      }
      else if (data.result.role === "ADMIN") {
        router.push("/administer/memberlist");
      }
    } catch (err) {
      console.error("로그인 에러:", err);
      setError("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  // 비밀번호 재발급 페이지로 이동
  const handleForgotPassword = () => {
    router.push("/reissuepassword");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#252E66]/80">
      {/* 헤더 */}
      <header className="absolute top-0 w-full bg-white py-4 shadow-sm">
        <div className="w-full flex items-center justify-between px-6">
          {/* 로고 */}
          <img src="/loginLogo.png" className="w-32" />
          {/* 로그인 버튼 */}
          <a
            href="/login"
            className="px-4 py-2 bg-[#252E66] text-white text-sm font-semibold rounded-md hover:bg-[#1F2557]"
          >
            로그인
          </a>
        </div>
      </header>

      {/* 로그인 박스 */}
      <div className="bg-white rounded-lg shadow-md px-20 pb-14 pt-20">
        <h2 className="text-3xl font-bold mb-2">로그인</h2>
        <p className="text-sm text-gray-600 mb-6">
          서비스를 사용하려면 로그인하세요.
        </p>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="nickname"
              id="nickname"
              value={nickname}
              onChange={handlenicknameChange}
              className="w-[440px] px-3 py-4 border rounded-md focus:ring-2 focus:ring-[#252E66] focus:outline-none"
              placeholder="닉네임을 입력하세요"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-[440px] px-3 py-4 border rounded-md focus:ring-2 focus:ring-[#252E66] focus:outline-none"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full bg-[#252E66] text-white py-3 rounded-md font-semibold hover:bg-[#1F2557]"
          >
            로그인
          </button>

          {/* 비밀번호 찾기 버튼 */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-[#252E66] hover:underline focus:outline-none"
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

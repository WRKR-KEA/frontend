"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/stores/userStore";
import api from "@/lib/api/axios"; 

export default function ChangePasswordPage() {
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nicknameError, setNicknameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const router = useRouter();
    const user = useUserStore((state) => state.user); // userStore에서 회원 정보 가져오기

    const handlenicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
        const nicknameRegex = /^[a-zA-Z0-9._%+-]+@gachon\.ac\.kr$/;
        if (!nicknameRegex.test(e.target.value)) {
            setNicknameError("아이디 형식이 올바르지 않습니다.");
        } else {
            setNicknameError("");
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*_-])[A-Za-z\d~!@#$%^&*_-]{8,12}$/;
        if (!passwordRegex.test(e.target.value)) {
            setPasswordError(
                "비밀번호는 특수문자(~!@#$%^&*_-), 숫자, 대문자를 포함하여 8자 ~ 12자여야 합니다."
            );
        } else {
            setPasswordError("");
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        if (e.target.value !== password) {
            setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 비밀번호 변경 요청
        try {
            const response = await api.patch("/api/user/members/password", {
                password,
                confirmPassword,
            });

            if (response.data.isSuccess) {
                alert("비밀번호 변경 성공!");

                // 역할에 따라 라우팅
                switch (user?.role) {
                    case "USER":
                        router.push("/user/home");
                        break;
                    case "MANAGER":
                        router.push("/manager/home");
                        break;
                    case "ADMIN":
                        router.push("/administer/memberlist");
                        break;
                    default:
                        break;
                }
            } else {
                alert("비밀번호 변경 실패: " + response.data.message);
            }
        } catch (error) {
            console.error("비밀번호 변경 에러:", error);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#252E66]/80">
            {/* 헤더 */}
            <header className="absolute top-0 w-full bg-white py-4 shadow-sm">
                <div className="w-full flex items-center justify-between px-6">
                    {/* 로고 */}
                    <img src="/loginLogo.png" className="w-32" />
                </div>
            </header>

            {/* 비밀번호 변경 박스 */}
            <div className="bg-white rounded-lg shadow-md px-20 pb-14 pt-20">
                <h2 className="text-3xl font-bold mb-2">비밀번호 변경</h2>
                <p className="text-sm text-gray-600 mb-6">
                    비밀번호를 변경하려면 정보를 입력하세요.
                </p>

                {/* 비밀번호 변경 폼 */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-[440px] px-3 py-4 border rounded-md focus:ring-2 focus:ring-[#252E66] focus:outline-none"
                            placeholder="새 비밀번호를 입력하세요"
                        />
                        {passwordError && (
                            <p className="text-red-500 text-sm mt-2 w-[440px] break-words">
                                {passwordError}
                            </p>
                        )}
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className="w-[440px] px-3 py-4 border rounded-md focus:ring-2 focus:ring-[#252E66] focus:outline-none"
                            placeholder="비밀번호 확인"
                        />
                        {confirmPasswordError && (
                            <p className="text-red-500 text-sm mt-2">{confirmPasswordError}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#252E66] text-white py-3 rounded-md font-semibold hover:bg-[#1F2557]"
                    >
                        비밀번호 변경
                    </button>
                </form>
            </div>
        </div>
    );
}

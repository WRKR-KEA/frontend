"use client";
import { useState } from "react";

export default function ChangePasswordPage() {
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nicknameError, setNicknameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const handlenicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);

        // 아이디 형식 검증
        const nicknameRegex = /^[a-zA-Z0-9._%+-]+@gachon\.ac\.kr$/;
        if (!nicknameRegex.test(e.target.value)) {
            setNicknameError("아이디 형식이 올바르지 않습니다.");
        } else {
            setNicknameError("");
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);

        // 비밀번호 조건 검증
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

        // 비밀번호 확인 검증
        if (e.target.value !== password) {
            setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("비밀번호 변경 성공!");
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
                        {/* <input
              type="nickname"
              id="nickname"
              value={nickname}
              onChange={handlenicknameChange}
              className="w-[440px] px-3 py-4 border rounded-md focus:ring-2 focus:ring-[#252E66] focus:outline-none"
              placeholder="아이디를를 입력하세요"
            />
            {nicknameError && <p className="text-red-500 text-sm mt-2">{nicknameError}</p>} */}
                    </div>
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

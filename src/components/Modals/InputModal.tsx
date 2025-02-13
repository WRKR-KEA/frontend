import React, { useEffect, useState } from "react";

interface InputModalProps {
    title: string;
    content?: string;
    onClick?: () => void;
    btnText?: string;
    setCategoryName: (value: string) => void;
    setCategoryAbb: (value: string) => void;
    setCategoryDescription?: (value: string) => void; // 추가된 상태 관리
    handleAddCategory: () => void;
}

export default function InputModal({
    title,
    content,
    onClick,
    btnText,
    setCategoryName,
    setCategoryAbb,
    setCategoryDescription,
    handleAddCategory
}: InputModalProps) {
    const [inputValue, setInputValue] = useState("");
    const [inputValue2, setInputValue2] = useState(""); // 두 번째 인풋 필드 상태 추가

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setInputValue(newValue)
        setCategoryAbb(newValue)

    };

    const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setInputValue2(newValue); // 즉시 업데이트
        setCategoryName(newValue)
        setCategoryDescription && setCategoryDescription(newValue);
    };

    return (
        <div className="flex flex-col items-center gap-3.5 pb-4 w-full">
            <h2 className="text-lg font-bold pt-6">{title}</h2>

            {/* 첫 번째 인풋 */}
            <input
                type="text"
                placeholder="약어를 입력하세요 ex)VM"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-grey-700 focus:border-blue-800"
            />

            {/* 두 번째 인풋 */}
            <input
                type="text"
                placeholder="카테고리 이름을 입력하세요..."
                value={inputValue2}
                onChange={handleInputChange2}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-grey-700 focus:border-blue-800"
            />

            {/* 버튼을 가로로 길게 변경 */}
            <button
                onClick={() => {
                    handleAddCategory();
                    onClick();
                    setInputValue("")
                    setInputValue2("")
                    setCategoryAbb("")
                    setCategoryName("")
                }}
                className={`w-full max-w-md px-4 py-2 text-white rounded-md text-center transition-all duration-200 
            ${inputValue.trim() === "" ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-700"}`}
                disabled={inputValue.trim() === ""}
            >
                {btnText || "확인"}
            </button>
        </div>

    );
}

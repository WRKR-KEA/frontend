import React, { useEffect, useState } from "react";

interface InputModalProps {
    title: string;
    content?: string;
    onClick?: () => void;
    btnText?: string;
    setCategoryName: (value: string) => void;
    handleAddCategory: () => void;
}

export default function InputModal({ title, content, onClick, btnText, setCategoryName, handleAddCategory }: InputModalProps) {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;

        setInputValue(newValue); // 즉시 업데이트
        setCategoryName(newValue)
    };

    // useEffect(() => {
    //     setCategoryName(inputValue); // 부모 상태도 즉시 업데이트
    // }, [inputValue])

    return (
        <div className="flex flex-col items-center gap-3.5 pb-4">
            <h2 className="text-lg font-bold pt-6">{title}</h2>
            <input
    type="text"
    placeholder="입력하세요..."
    value={inputValue}
    onChange={handleInputChange}
    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-grey-700 focus:border-blue-900"
/>

            <button
                onClick={() => {
                    handleAddCategory();
                    onClick();
                }}
                className={`self-center max-w-fit px-8 py-2 text-white rounded-md transition-all duration-200 
        ${inputValue.trim() === "" ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-700"}`}
                disabled={inputValue.trim() === ""}
            >
                {btnText || "확인"}
            </button>

        </div>
    );
}

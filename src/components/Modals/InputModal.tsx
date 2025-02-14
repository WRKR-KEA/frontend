import React, { useEffect, useState } from "react";

interface InputModalProps {
  title: string;
  onClick?: () => void;
  btnText?: string;
  setCategoryName: (value: string) => void;
  setCategoryAbb: (value: string) => void;
  setCategoryDescription?: (value: string) => void;
  handleAddCategory: () => Promise<boolean>;
}

export default function InputModal({
  title,
  onClick,
  btnText,
  setCategoryName,
  setCategoryAbb,
  setCategoryDescription,
  handleAddCategory
}: InputModalProps) {
  const [inputAbb, setInputAbb] = useState("");
  const [inputName, setInputName] = useState("");
  const [isValidAbb, setIsValidAbb] = useState(true);

    const handleInputAbb = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      const abbRegex = /^[A-Z]{2}/;

      setIsValidAbb(!newValue || abbRegex.test(newValue));

      setInputAbb(newValue)
      setCategoryAbb(newValue)
    };

    const handleInputName = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInputName(newValue); // 즉시 업데이트
      setCategoryName(newValue)
      setCategoryDescription && setCategoryDescription(newValue);
    };

  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
    setIsDisabled(!(inputName && inputAbb && isValidAbb))
  }, [inputAbb, inputName]);

  return (
      <div className="flex flex-col items-center gap-3.5 pb-4 w-full">
        <h2 className="text-lg font-bold pt-6">{title}</h2>

        {/* 첫 번째 인풋 */}
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="약어를 입력하세요. ex) VM"
            value={inputAbb}
            onChange={handleInputAbb}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-2 focus:border-main-1"
          />
          {isValidAbb || (
            <p className="text-red-500 text-sm mt-2">카테고리 약어는 영문 대문자로 2자여야 합니다.</p>
          )}
        </div>

        {/* 두 번째 인풋 */}
        <input
          type="text"
          placeholder="카테고리 이름을 입력하세요."
          value={inputName}
          onChange={handleInputName}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-2 focus:border-main-1"
        />

        {/* 버튼을 가로로 길게 변경 */}
        <button
          onClick={() => {
            handleAddCategory().then(result => {
              if (result) {
                onClick();
                setInputAbb("")
                setInputName("")
                setCategoryAbb("")
                setCategoryName("")
              }
            });
          }}
          className="px-8 py-2 text-white bg-main-1 rounded-md text-center transition-all duration-200
          hover:bg-main-hover disabled:opacity-50 disabled:hover:bg-main-1"
          disabled={isDisabled}
        >
          {btnText || "확인"}
        </button>
      </div>

    );
}

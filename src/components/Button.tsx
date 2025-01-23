// components/Button.tsx
import React from 'react';

type ButtonProps = {
  label: string;
  onClick: () => void;
  color: 1 | 2 | 3 | 4 | 5; // 색상 옵션: 1=파란색, 2=빨간색, 3=초록색, 4=회색, 5=노란색
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ label, onClick, color, className = '' }) => {
  // 색상에 따른 클래스 설정
  let buttonClass = '';
  if (color === 1) {
    buttonClass = 'text-white w-[95px] bg-[#252E66] hover:bg-[#000034]'; 
  } else if (color === 2) {
    buttonClass = 'text-white w-[95px] bg-[#DF4B38] hover:bg-[#AD1906]'; 
  } else if (color === 3) {
    buttonClass = 'text-white w-[95px] bg-[#3A966F] hover:bg-[#08643D]'; 
  } else if (color === 4) {
      buttonClass = 'text-white w-[95px] bg-gray-500 hover:bg-gray-600';   
  } else if (color === 5) {
    buttonClass = 'text-white w-[95px] bg-yellow-500 hover:bg-yellow-600';   
  }

  return (
    <button 
      onClick={onClick} 
      className={`px-3 py-2 text-sm font-semibold rounded-md ${buttonClass} ${className} transition-colors duration-200`}
    >
      {label}
    </button>
  );
};

export default Button;
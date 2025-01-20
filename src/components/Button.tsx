// components/Button.tsx
import React from 'react';

type ButtonProps = {
  label: string;
  onClick: () => void;
  color: 1 | 2 | 3; // 색상 옵션: 1=파란색, 2=빨간색, 3=초록색
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ label, onClick, color, className = '' }) => {
  // 색상에 따른 클래스 설정
  let buttonClass = '';
  if (color === 1) {
    buttonClass = 'text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white'; 
  } else if (color === 2) {
    buttonClass = 'text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white'; 
  } else if (color === 3) {
    buttonClass = 'text-green-500 border-2 border-green-500 hover:bg-green-500 hover:text-white'; 
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
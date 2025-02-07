import React from "react";

interface AlertModalProps {
  title: string;
  content?: string;
  onClick?:()=>void;
  btnText?:string;
}

const AlertModal: React.FC<AlertModalProps> = ({title, content, onClick, btnText}) => {
  return (
    <div className="flex flex-col items-center gap-3.5 pb-4">
      <h2 className="text-lg font-bold pt-6">{title}</h2>
      <p className="text-sm mt-2">{content}</p>
      <button onClick={onClick} className="self-center bg-gray-600 max-w-fit px-8 py-2 text-white rounded-md">{btnText}</button>
    </div>
  );
};

export default AlertModal;
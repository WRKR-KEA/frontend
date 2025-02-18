import React from "react";

interface AlertTicketModalProps {
  title: string;
  content?: string;
  onClick?:()=>void;
  btnText?:string;
}

const AlertModal: React.FC<AlertTicketModalProps> = ({title, content, onClick, btnText}) => {
  return (
    <div className="flex flex-col items-center gap-2 pb-4 w-56">
      <h2 className="text-lg font-bold pt-6">{title}</h2>
      <p className="text-sm mt-2">{content}</p>
    </div>
  );
};

export default AlertModal;
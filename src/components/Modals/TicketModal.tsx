import React, { useEffect, useState } from "react";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  zIndex?: string;
}

export default function Modal({ onClose, children, zIndex = "50" }: ModalProps) {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    setIsShowing(true);
    return () => setIsShowing(false);
  }, []);

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-${zIndex}`}>
      <div
        className={`
          bg-white p-6 rounded-lg text-center shadow-lg relative
          transform transition-all duration-300 ease-in-out
          ${isShowing ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
        `}
      >
        {children}
      </div>
    </div>
  );
}
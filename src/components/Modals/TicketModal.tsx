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
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
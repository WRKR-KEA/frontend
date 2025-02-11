import React, { useEffect, useState } from 'react';

interface ModalHelpProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalHelp({ onClose, children }: ModalHelpProps) {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    setIsShowing(true);
    return () => setIsShowing(false);
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`
          fixed inset-0 bg-gray-500 transition-opacity duration-300 ease-in-out
          ${isShowing ? 'opacity-50' : 'opacity-0'}
        `}
      />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className={`
              bg-white p-4  rounded shadow-lg w-[800px] h-[600px] relative ml-48
              transform transition-all duration-300 ease-in-out
              ${isShowing ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
            `}
          >
            <button
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
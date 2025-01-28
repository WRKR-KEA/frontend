import React from "react";

interface sparkleButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export default function sparkleButton({ onClick, children }: sparkleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative px-8 py-3 bg-[#6E61CA] text-white font-bold text-lg rounded-lg overflow-hidden animate-pulse hover:scale-105 transition-transform"
    >
      <span>{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-25 blur-xl animate-flicker"></div>
      <style jsx>{`
        @keyframes flicker {
          0% {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.3),
                        0 0 10px rgba(255, 255, 255, 0.2),
                        0 0 15px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5),
                        0 0 20px rgba(255, 255, 255, 0.4),
                        0 0 30px rgba(255, 255, 255, 0.2);
          }
          100% {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.3),
                        0 0 10px rgba(255, 255, 255, 0.2),
                        0 0 15px rgba(255, 255, 255, 0.1);
          }
        }

        .animate-flicker {
          animation: flicker 1.5s infinite alternate;
        }
      `}</style>
    </button>
  );
}
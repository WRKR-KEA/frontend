import React from "react";

interface HelpProps {
  content: string;
}

const Help: React.FC<HelpProps> = ({ content }) => {
  return (
    <div>
      <h2 className="text-lg font-bold">{content} 도움말</h2>
      <p className="text-sm mt-2">{content}</p>
    </div>
  );
};

export default Help;
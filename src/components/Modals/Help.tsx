import React from "react";

interface HelpProps {
  title: string;
  content: string;
}

const Help: React.FC<HelpProps> = ({ title: title, content: content }) => {
  return (
    <div>
      <h2 className="text-lg font-bold">{title} 도움말</h2>
      <p className="text-sm mt-2">{content}</p>
    </div>
  );
};

export default Help;
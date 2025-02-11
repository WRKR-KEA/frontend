import React from "react";
import ReactMarkdown from "react-markdown";

interface HelpProps {
  title: string;
  content: string;
}

const Help: React.FC<HelpProps> = ({ title, content }) => {
  return (
    <div>
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="text-sm mt-2">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Help;

import { ChangeEvent } from "react";

interface TemplateProps {
  title: string;
  content: string;
  setTitle: (value: string) => void;
  setContent: (value: string) => void;
}

export default function Template({ title, content, setTitle, setContent }: TemplateProps) {
  return (
    <div>
      <h2 className="text-md font-semibold w-60 mb-4">템플릿 작성</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          제목
        </label>
        <input
          type="text"
          id="title"
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          내용
        </label>
        <textarea
          id="content"
          className="w-full border border-gray-300 rounded-md p-2"
          style={{ height: "360px" }}
          placeholder="내용을 입력해주세요."
          value={content}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
        />
      </div>
    </div>
  );
}
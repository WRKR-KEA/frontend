import { ChangeEvent, useState } from "react";

interface TemplateProps {
  title: string;
  content: string;
  setTitle: (value: string) => void;
  setContent: (value: string) => void;
}

export default function Template({ title, content, setTitle, setContent }: TemplateProps) {
  const [titleError, setTitleError] = useState<string>("");

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 50) {
      setTitleError("제목은 50자까지 입력이 가능합니다.");
    } else {
      setTitleError("");
      setTitle(value); // 제목 상태를 업데이트
    }
  };

  return (
    <div>
      <h2 className="text-md font-semibold w-60 mb-4 mt-12">템플릿 작성</h2>
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
          onChange={handleTitleChange} // handleTitleChange로 입력 처리
        />
        {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
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
import { ChangeEvent, useState, useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";

interface TemplateProps {
  title: string;
  content: string;
  setTitle: (value: string) => void;
  setContent: (value: string) => void;
}

export default function Template({ title, content, setTitle, setContent }: TemplateProps) {
  const [titleError, setTitleError] = useState<string>("");
  const editorRef = useRef<any>(null); // Editor 컴포넌트 참조

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 50) {
      setTitleError("제목은 50자까지 입력이 가능합니다.");
    } else {
      setTitleError("");
      setTitle(value); // 제목 상태를 업데이트
    }
  };

  const handleEditorChange = () => {
    const editorContent = editorRef.current.getInstance().getMarkdown();
    setContent(editorContent); // Toast UI 에디터에서 내용 변경 시 상태 업데이트
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
          onChange={handleTitleChange} // handleTitleChange로 제목 입력 처리
        />
        {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          내용
        </label>
        <div className="p-4">
          <Editor
            ref={editorRef}
            initialValue={content}
            placeholder="도움말을 입력하세요"
            previewStyle="vertical"
            height="500px"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            onChange={handleEditorChange} // Editor 내용이 변경될 때 상태 업데이트
          />
        </div>
      </div>
    </div>
  );
}
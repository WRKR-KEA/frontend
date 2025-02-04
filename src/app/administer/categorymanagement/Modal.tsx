"use client";

import React, { useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";

interface ModalProps {
  isOpen: boolean;
  title: string;
  content?: string;
  onClose: () => void;
  onSave: (editorContent: string) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, content = "", onClose, onSave }) => {
  const editorRef = useRef<Editor>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    if (editorRef.current) {
      const editorContent = editorRef.current.getInstance().getMarkdown();
      onSave(editorContent);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[800px] rounded-lg shadow-lg">
        {/* Modal Header */}
        <div className="p-10 border-b">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>

        {/* Toast UI Editor */}
        <div className="p-4">
          <Editor
            ref={editorRef}
            initialValue={content}
            previewStyle="vertical"
            height="500px" // 높이 증가
            initialEditType="markdown"
            useCommandShortcut={true}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-400 transition-all"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600 transition-all"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
"use client";

import React, { useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useTemplateQuery } from "@/hooks/useTemplate"; // ✅ 템플릿 데이터 가져오는 쿼리

interface TemplateModalProps {
  categoryId: string;
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (editorContent: string) => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ categoryId, isOpen, title, onClose, onSave }) => {
  const editorRef = useRef<Editor>(null);

  if (!isOpen) return null;

  console.log("템플릿 모달 - 카테고리 ID:", categoryId);

  const { data, isLoading, isError, refetch } = useTemplateQuery(categoryId);

  console.log("템플릿 쿼리 결과:", data);



  const handleSave = async () => {
    if (!editorRef.current) return;

    const editorContent = editorRef.current.getInstance().getMarkdown();

    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
      }


      if (!data) {
        const response = await fetch(`http://172.16.211.53:8080/api/admin/templates`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            categoryId: categoryId,
            content: editorContent, // ✅ 에디터 내용 추가
          }),
        });
        if (!response.ok) {
          throw new Error("템플릿 저장 실패");
        }
      } else {
        const response = await fetch(`http://172.16.211.53:8080/api/admin/templates/${categoryId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            content: editorContent, // ✅ 에디터 내용 추가
          }),
        });
        if (!response.ok) {
          throw new Error("템플릿 저장 실패");
        }
      }


      alert("템플릿이 성공적으로 저장되었습니다.");
      refetch()
      onClose();
    } catch (error) {
      console.error("❌ 템플릿 저장 오류:", error);
      alert("템플릿을 저장하는 중 오류가 발생했습니다.");
    }
  };


  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className="pt-10 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[800px] rounded-lg shadow-lg">
        {/* Modal Header */}
        <div className="p-10 border-b">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>

        {/* Toast UI Editor */}
        <div className="p-4">
          <Editor
            ref={editorRef}
            initialValue={data?.result.content || "템플릿 내용을 입력하세요."}
            previewStyle="vertical"
            height="500px"
            initialEditType="wysiwyg"
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
            {!data ? "추가" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;

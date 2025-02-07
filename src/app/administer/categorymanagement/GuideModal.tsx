"use client";

import React, { useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useGuideQuery } from "@/hooks/useGuide"; // ✅ 가이드 데이터 가져오는 쿼리
import FileBox from "./FileList";

interface GuideModalProps {
  categoryId: string;
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (editorContent: string) => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ categoryId, isOpen, title, onClose, onSave }) => {
  const editorRef = useRef<Editor>(null);

  if (!isOpen) return null;

  console.log("가이드 모달 - 카테고리 ID:", categoryId);

  const { data, isLoading, isError, refetch } = useGuideQuery(categoryId);
  const guideId = data?.result.guideId
  console.log("가이드 쿼리 결과:", data);

  // ✅ initialValue 값이 null 또는 undefined면 빈 문자열("")을 넣어줌
  const initialMarkdown = typeof data?.result.content === "string" ? data.result.content : "";

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
        // ✅ 데이터가 없을 경우 새로운 가이드 추가 (POST)
        const response = await fetch(`http://172.16.211.53:8080/api/admin/guide/${categoryId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            content: editorContent,
            attachments:[]
          }),
        });
        if (!response.ok) {
          throw new Error("가이드 추가 실패");
        }
      } else {
        // ✅ 기존 데이터가 있을 경우 가이드 수정 (PATCH)
        const response = await fetch(`http://172.16.211.53:8080/api/admin/guide/${guideId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            content: editorContent,
            attachments:[]
          }),
        });
        if (!response.ok) {
          throw new Error("가이드 저장 실패");
        }
      }

      alert("가이드가 성공적으로 저장되었습니다.");
      refetch();
      onClose();
    } catch (error) {
      console.error("❌ 가이드 저장 오류:", error);
      alert("가이드를 저장하는 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return <div>불러오는 중...</div>;
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
            initialValue={initialMarkdown} // ✅ 수정: 문자열이 아닐 경우 빈 문자열로 설정
            previewStyle="vertical"
            height="500px"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
          />
        </div>
        <FileBox/>

        {/* Modal Footer */}
        <div className="p-4 flex justify-end space-x-2">
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

export default GuideModal;

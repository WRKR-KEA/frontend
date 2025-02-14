"use client";

import React, { useEffect, useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useTemplateQuery } from "@/hooks/useTemplate"; // ✅ 템플릿 데이터 가져오는 쿼리
import { useQueryClient } from "@tanstack/react-query"; // ✅ React Query 클라이언트 가져오기
import Skeleton from "@/components/Skeleton";

interface TemplateModalProps {
  categoryId: string;
  isOpen: boolean;
  title: string;
  onClose: () => void;
  refetchList: () => void;
  showModal: () => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ categoryId, isOpen, title, onClose, showModal }) => {
  const editorRef = useRef<Editor>(null);

  const queryClient = useQueryClient(); // ✅ queryClient 가져오기
  if (!isOpen) return null;

  const { data, isLoading, isFetching, refetch } = useTemplateQuery(categoryId);
  const templateId = data?.result.templateId;

  const initialMarkdown = data?.result.content || " ";

  const [isDisabled, setIsDisabled] = useState(null);
  const handleEditorChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.getInstance().getMarkdown().trim();
      setIsDisabled(content === "");
    }
  };

  const handleSave = async () => {
    if (!editorRef.current) return;

    const editorContent = editorRef.current.getInstance().getMarkdown();

    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        showModal("로그인이 필요합니다.");
        return;
      }

      const method = data ? "PATCH" : "POST";
      const url = data
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/templates/${categoryId}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/templates`;

      const body = JSON.stringify({
        categoryId: !data ? categoryId : undefined,
        content: editorContent,
      });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body,
      });

      if (!response.ok) throw new Error("템플릿 저장 실패");

      showModal("템플릿이 성공적으로 저장되었습니다.", "확인", () => {
        refetch();
      });

      onClose();
    } catch (error) {
      console.error("❌ 템플릿 저장 오류:", error);
      showModal("⚠ 템플릿을 저장하는 중 오류가 발생했습니다.");
    }
  };

  // ✅ 템플릿 삭제 함수
  const handleDelete = async () => {
    if (!templateId) {
      showModal("템플릿 ID를 찾을 수 없습니다.");
      return;
    }

    if (!confirm("정말 이 템플릿을 삭제하시겠습니까?")) return;

    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        showModal("로그인이 필요합니다.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/templates/${templateId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("템플릿 삭제 실패");


      // await refetchList()
      showModal("템플릿이 삭제되었습니다.", "확인", () => {
        refetch();
      });
      queryClient.setQueryData(["template_detail", categoryId], null);
      onClose(); // ✅ 모달 닫기
    } catch (error) {
      showModal("템플릿을 삭제하는 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return <Skeleton width={"100%"} height={"100%"} />
  }

  return (
    <div className="p-10 fixed inset-0 flex justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[800px] rounded-lg shadow-lg overflow-auto hide-scrollbar">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b sticky top-0 bg-white z-40">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>

        {/* Toast UI Editor */}
        <div className="p-4">
          <Editor
            ref={editorRef}
            initialValue={initialMarkdown}
            placeholder="템플릿을 입력하세요."
            previewStyle="vertical"
            height="auto"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            onChange={handleEditorChange}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t flex justify-end space-x-2 sticky bottom-0 bg-white z-40">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border-main-1 border-2 text-main-1 text-sm font-semibold rounded-md hover:bg-gray-5 hover:border-main-hover transition-all"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-main-1 text-white text-sm font-semibold rounded-md hover:bg-main-hover disabled:opacity-50 disabled:hover:bg-main-1 transition-all"
            disabled={isDisabled == null ? !initialMarkdown.trim() : isDisabled}
          >
            {!data ? "추가" : "저장"}
          </button>
          {data?.result.templateId && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-accent-1 text-white text-sm font-semibold rounded-md hover:bg-accent-hover transition-all"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
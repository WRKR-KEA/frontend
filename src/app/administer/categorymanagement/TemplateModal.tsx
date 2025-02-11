"use client";

import React, { useEffect, useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useTemplateQuery } from "@/hooks/useTemplate"; // ✅ 템플릿 데이터 가져오는 쿼리
import { useQueryClient } from "@tanstack/react-query"; // ✅ React Query 클라이언트 가져오기

interface TemplateModalProps {
  categoryId: string;
  isOpen: boolean;
  title: string;
  onClose: () => void;
  refetchList: ()=> void;
  showModal:()=> void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ categoryId, isOpen, title, onClose, showModal }) => {
  const editorRef = useRef<Editor>(null);

  const queryClient = useQueryClient(); // ✅ queryClient 가져오기
  if (!isOpen) return null;

  const { data, isLoading, isFetching, refetch } = useTemplateQuery(categoryId);
  const templateId = data?.result.templateId;

  useEffect(() => {
    if (!isFetching && editorRef.current) {
      editorRef.current.getInstance().setMarkdown(
        data?.result.content || "템플릿 내용을 입력하세요."
      );
    }
  }, [isFetching, data]);

  const handleSave = async () => {
    if (!editorRef.current) return;

    const editorContent = editorRef.current.getInstance().getMarkdown().trim(); // ✅ 공백 제거 후 확인

    if (editorContent === "") {
      showModal("공백은 작성할 수 없습니다. 내용을 입력해주세요.");
      return;
    }

    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        showModal("로그인이 필요합니다.");
        return;
      }

      const method = data ? "PATCH" : "POST";
      const url = data
        ? `http://172.16.211.53:8080/api/admin/templates/${categoryId}`
        : `http://172.16.211.53:8080/api/admin/templates`;

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
        `http://172.16.211.53:8080/api/admin/templates/${templateId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("템플릿 삭제 실패");

    
      // await refetchList()
      showModal("템플릿이 성공적으로 저장되었습니다.", "확인", () => {
        refetch(); 
      });
      queryClient.setQueryData(["template_detail", categoryId], null);
      onClose(); // ✅ 모달 닫기
    } catch (error) {
      console.error("❌ 템플릿 저장 오류:", error);
      showModal("템플릿을 삭제하는 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) return <div>Loading...</div>;

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
          {data?.result.templateId && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 transition-all"
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
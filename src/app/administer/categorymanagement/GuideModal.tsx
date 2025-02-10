"use client";

import React, { useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useGuideQuery } from "@/hooks/useGuide"; // ✅ 가이드 데이터 가져오는 쿼리
import FileBox from "./FileBox";

interface GuideModalProps {
  categoryId: string;
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (editorContent: string) => void;
  showModal:()=> void;
}

const GuideModal: React.FC<GuideModalProps> = ({ categoryId, isOpen, title, onClose, onSave, showModal }) => {
  const editorRef = useRef<Editor>(null);
  const [attachments, setAttachments] = useState<File[]>([]); // ✅ 파일 리스트 상태 추가

  if (!isOpen) return null;

  console.log("가이드 모달 - 카테고리 ID:", categoryId);

  const { data, isLoading, isError, refetch } = useGuideQuery(categoryId);
  const guideId = data?.result?.guideId;
  console.log("가이드 쿼리 결과:", data);

  // ✅ initialValue 값이 null 또는 undefined면 빈 문자열("")을 넣어줌
  const initialMarkdown = typeof data?.result.content === "string" ? data.result.content : "도움말을 입력하세요";

  // ✅ 파일 업로드 처리 함수
  const handleFileUpload = (uploadedFiles: File[]) => {
    setAttachments(uploadedFiles); // 파일 리스트 업데이트
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
  
    const editorContent = editorRef.current.getInstance().getMarkdown();
  
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
      }
  
      // ✅ Multipart FormData 생성
      const formData = new FormData();
  
      // ✅ `data` 유무에 따라 다른 요청 데이터 추가
      const requestData = JSON.stringify(
        data ? { content: editorContent, guideId } : { content: editorContent }
      );
  
      formData.append(
        data ? "guideUpdateRequest" : "guideCreateRequest",
        new Blob([requestData], { type: "application/json" })
      );
  
      // ✅ 첨부 파일 추가 (여러 개 가능)
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
  
      const method = data ? "PATCH" : "POST";
      const url = data
        ? `http://172.16.211.53:8080/api/admin/guide/${guideId}`
        : `http://172.16.211.53:8080/api/admin/guide/${categoryId}`;
  
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData, // ✅ JSON + 파일을 함께 전송 (multipart/form-data)
      });
  
      if (!response.ok) {
        throw new Error("가이드 저장 실패");
      }
  
      alert("가이드가 성공적으로 저장되었습니다.");
      refetch();
      onClose();
    } catch (error) {
      console.error("❌ 가이드 저장 오류:", error);
      alert("가이드를 저장하는 중 오류가 발생했습니다.");
    }
  };
  


  // 가이드 삭제 함수
  const handleDelete = async () => {
    if (!guideId) {
      showModal("도움말 ID를 찾을 수 없습니다.");
      return;
    }

    if (!confirm("정말 이 도움말을을 삭제하시겠습니까?")) return;

    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        showModal("로그인이 필요합니다.");
        return;
      }

      const response = await fetch(`http://172.16.211.53:8080/api/admin/guide/${guideId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("템플릿 삭제 실패");

      showModal("가이드가 성공적으로 삭제되었습니다.", "확인", () => {
        refetch(); 
      });
      onClose(); // ✅ 모달 닫기
    } catch (error) {
      console.error("❌ 템플릿 삭제 오류:", error);
      showModal("가이드를 삭제하는 중 오류가 발생했습니다.");

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

        {/* ✅ 파일 업로드 영역 추가 */}
        <FileBox onFileUpload={handleFileUpload} />

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
          {data?.result.guideId && (
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

export default GuideModal;
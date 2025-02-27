"use client";

import React, { useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useGuideQuery } from "@/hooks/useGuide"; // ✅ 도움말 데이터 가져오는 쿼리
import FileBox from "./FileBox";
import { useQueryClient } from "@tanstack/react-query"; // ✅ React Query 클라이언트 가져오기
import Skeleton from "@/components/Skeleton";

interface GuideModalProps {
  categoryId: string;
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (editorContent: string) => void;
  showModal: (title: string, btnText?: string, onCloseCallback?: () => void) => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ categoryId, isOpen, title, onClose, onSave, showModal }) => {
  const editorRef = useRef<Editor>(null);
  const [attachments, setAttachments] = useState<File[]>([]); // ✅ 파일 리스트 상태 추가

  const queryClient = useQueryClient(); // ✅ queryClient 가져오기
  const [deleteAttachments, setDeleteAttachments] = useState([])

  if (!isOpen) return null;

  console.log("도움말 모달 - 카테고리 ID:", categoryId);

  const { data, isLoading, isError, refetch } = useGuideQuery(categoryId);
  const guideId = data?.result?.guideId;
  console.log("도움말 쿼리 결과:", data);

  const initialMarkdown = data?.result.content || " ";

  const [isDisabled, setIsDisabled] = useState(null);
  const handleEditorChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.getInstance().getMarkdown().trim();
      setIsDisabled(content === "");
    }
  };

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
        showModal("로그인이 필요합니다.");
        return;
      }

      // ✅ Multipart FormData 생성
      const formData = new FormData();

      // ✅ `data` 유무에 따라 다른 요청 데이터 추가
      const requestData = JSON.stringify(
        data ? { content: editorContent, deleteAttachments, guideId } : { content: editorContent }
      );

      formData.append(
        data ? "guideUpdateRequest" : "guideCreateRequest",
        new Blob([requestData], { type: "application/json" })
      );

      // ✅ 첨부 파일 추가 (여러 개 가능)
      attachments.forEach((file) => {
        formData.append(data ? "newAttachments" : "attachments", file);
      });

      const method = data ? "PATCH" : "POST";
      const url = data
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/guide/${guideId}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/guide/${categoryId}`;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData, // ✅ JSON + 파일을 함께 전송 (multipart/form-data)
      });

      if (!response.ok) {
        throw new Error("도움말 저장 실패");
      }

      showModal("도움말이 성공적으로 저장되었습니다.");

      refetch();
      onClose();
    } catch (error) {
      console.error("❌ 도움말 저장 오류:", error);
      showModal("도움말을 저장하는 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!guideId) {
      showModal("도움말 ID를 찾을 수 없습니다.");
      return;
    }

    if (!confirm("정말 이 도움말을 삭제하시겠습니까?")) return;

    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        showModal("로그인이 필요합니다.");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/guide/${guideId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("도움말 삭제 실패");

      showModal("도움말이 성공적으로 삭제되었습니다.", "확인", () => {
        refetch();
      });
      queryClient.setQueryData(["guide_detail", categoryId], null);
      onClose(); // ✅ 모달 닫기
    } catch (error) {
      console.error("❌ 템플릿 삭제 오류:", error);
      showModal("도움말을 삭제하는 중 오류가 발생했습니다.");

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
            placeholder="도움말을 입력하세요"
            previewStyle="vertical"
            height="500px"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            onChange={handleEditorChange}
          />
        </div>

        {/* ✅ 파일 업로드 영역 추가 */}

        <div className="mx-8 mb-4">
          <FileBox
            onFileUpload={handleFileUpload}
            attachments={data?.result?.attachmentUrls}
            setDeleteAttachments={setDeleteAttachments}
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
          {data?.result.guideId && (
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

export default GuideModal;
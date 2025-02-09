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
}

const GuideModal: React.FC<GuideModalProps> = ({
  categoryId,
  isOpen,
  title,
  onClose,
  onSave,
}) => {
  const editorRef = useRef<Editor>(null);
  const [attachments, setAttachments] = useState<File[]>([]); // ✅ 파일 리스트 상태 추가
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText: "",
    onClose: () => {},
  });

  const showModal = (title: string, btnText = "닫기") => {
    setModalState({
      isOpen: true,
      title,
      btnText,
      onClose: () => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  if (!isOpen) return null;

  console.log("가이드 모달 - 카테고리 ID:", categoryId);

  const { data, isLoading, isError, refetch } = useGuideQuery(categoryId);
  const guideId = data?.result.guideId;
  console.log("가이드 쿼리 결과:", data);

  // ✅ initialValue 값이 null 또는 undefined면 빈 문자열("")을 넣어줌
  const initialMarkdown =
    typeof data?.result.content === "string" ? data.result.content : "";

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

      // ✅ FormData 객체 생성 (multipart/form-data)
      const formData = new FormData();

      // ✅ 가이드 내용 JSON 추가
      formData.append(
        "guideUpdateRequest",
        new Blob([JSON.stringify({ content: editorContent })], {
          type: "application/json",
        })
      );

      // ✅ 첨부 파일 추가 (멀티파트 타입 지정)
      attachments.forEach((file) => {
        formData.append(
          "attachments",
          new Blob([file], { type: file.type }),
          file.name
        );
      });

      const method = data ? "PATCH" : "POST";
      const url = data
        ? `http://172.16.211.53:8080/api/admin/guide/${guideId}`
        : `http://172.16.211.53:8080/api/admin/guide/${categoryId}`;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`, // ✅ `Content-Type` 자동 설정
        },
        body: formData, // ✅ FormData 전송
      });

      if (!response.ok) {
        throw new Error("가이드 저장 실패");
      }

      showModal("가이드가 성공적으로 저장되었습니다.");
      refetch();
      onClose();
    } catch (error) {
      console.error("❌ 가이드 저장 오류:", error);
      showModal("가이드를 저장하는 중 오류가 발생했습니다.");
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

      {modalState.isOpen && (
        <Modal onClose={modalState.onClose}>
          <AlertModal
            title={modalState.title}
            onClick={modalState.onClose}
            btnText={modalState.btnText}
          />
        </Modal>
      )}
    </div>
  );
};

export default GuideModal;
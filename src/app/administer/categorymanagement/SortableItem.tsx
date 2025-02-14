"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import GuideModal from "./GuideModal"; // ✅ 도움말 모달
import TemplateModal from "./TemplateModal"; // ✅ 템플릿 모달
import Modal from "@/components/Modals/Modal";
import AlertModal from "@/components/Modals/AlertModal";
import axios from "axios";
interface SortableItemProps {
  categoryId: number;
  name: string;
  abbreviation: string;
  refetch: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  categoryId,
  name,
  abbreviation,
  refetch,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: categoryId });

  const [isEditing, setIsEditing] = useState(false);
  const [editValueName, setEditValueName] = useState(name);
  const [editValueAbb, setEditValueAbb] = useState(abbreviation);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"guide" | "template" | null>(null); // ✅ 모달 타입 추가
  const [modalTitle, setModalTitle] = useState("");

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText: '',
    onClose: () => { },
    onClose2: () => { },
  });

  const showModal = (title: string, btnText = "닫기", onCloseCallback?: () => void) => {
    setModalState({
      isOpen: true,
      title,
      btnText,
      onClose: () => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
        if (onCloseCallback) onCloseCallback(); // ✅ 모달 닫힌 후 실행할 콜백 함수 실행
      },
      onClose2: () => {
        setModalState((prev) => ({ ...prev, isOpen: false }));

      },
    });
  };


  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "",
  };

  // ✅ 카테고리 수정 함수
const handleSave = async () => {
  if (!editValueName.trim()) {
    showModal("이름을 입력해주세요.");
    return;
  }

  try {
    const accessToken = sessionStorage.getItem("accessToken");

    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/categories/${categoryId}`,
      { 
        name: editValueName.trim(), 
        abbreviation: editValueAbb.trim() 
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`HTTP 오류: ${response.status} - ${response.statusText}`);
    }

    showModal("카테고리가 성공적으로 수정되었습니다.");
    setIsEditing(false);
    refetch();
  } catch (error) {
    console.error("❌ 카테고리 수정 오류:", error);

    if (axios.isAxiosError(error)) {
      console.error("📌 오류 응답 상태 코드:", error.response?.status);
      console.error("📌 오류 메시지:", error.response?.data?.message || "서버 오류 발생");
      console.error("📌 오류 응답 데이터:", error.response?.data);
    } else {
      console.error("📌 예기치 않은 오류:", error);
    }

    showModal(error.response?.data?.message 
      // + (error.response?.data?.result?.name || error.response?.data?.result.abbreviation) 
    );
  }
};


  // ✅ 카테고리 삭제 함수
  const handleCategoryDelete = async () => {
    showModal("정말로 삭제하시겠습니까?", "확인", async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/categories/${categoryId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("카테고리 삭제 실패");
        }


        showModal("카테고리가 성공적으로 삭제되었습니다.", "확인", () => {
          refetch();
        });
      } catch (error) {
        console.error("❌ 카테고리 삭제 오류:", error);
        showModal("카테고리를 삭제하는 중 오류가 발생했습니다.");
      }
    })
  };

  const handleOpenModal = (type: "guide" | "template") => {
    setIsHovered(false);
    setModalType(type);
    setModalTitle(`${name} - ${type === "guide" ? "도움말" : "템플릿"}`);
    setIsModalOpen(true);
  };

  // ✅ 모달 닫기 함수
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsHovered(false); // ✅ 모달 닫힐 때 hover 초기화
    setModalType(null);
  };

  return (
    <>
      <li
        ref={setNodeRef}
        style={style}
        className="bg-gray-50 border border-gray-200 rounded-md hover:shadow transition-shadow relative"
        onMouseEnter={() => !isModalOpen && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ✅ 모달 (도움말 / 템플릿) */}
        {isModalOpen && modalType === "guide" && (
          <GuideModal
            categoryId={categoryId.toString()}
            isOpen={isModalOpen}
            title={modalTitle}
            onClose={handleCloseModal}
            onSave={handleCloseModal}
            showModal={showModal}
          />
        )}

        {isModalOpen && modalType === "template" && (
          <TemplateModal
            categoryId={categoryId.toString()}
            isOpen={isModalOpen}
            title={modalTitle}
            onClose={handleCloseModal}
            showModal={showModal}

          />
        )}

        <div className="flex items-center justify-between p-4 max-h-12">
          <div className="flex items-center space-x-4">
            <div {...attributes} {...listeners} className="">
              <img src="/hamburg.png" alt="drag" className="w-5 cursor-grab" />
            </div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editValueAbb}
                  onChange={(e) => setEditValueAbb(e.target.value)}
                  className="border rounded w-12 px-2 py-1 text-gray-700"
                  autoFocus
                />
                <input
                  type="text"
                  value={editValueName}
                  onChange={(e) => setEditValueName(e.target.value)}
                  className="border rounded w-40 px-2 py-1 text-gray-700"
                  autoFocus
                />

              </>
            ) : (
              <div>
                <span className="text-lg font-semibold text-gray-700 pointer-events-none">
                  {`[${abbreviation != "" ? abbreviation : "AB"}] `}
                </span>
                <span className="text-lg font-semibold text-gray-700 pointer-events-none">
                  {name}
                </span>
              </div>
            )}
          </div>

          {/* ✅ 모달이 열려있지 않을 때만 버튼 표시 */}
          {isHovered && !isDragging && !isModalOpen && (
            <div className="absolute right-4 flex space-x-2 p-1 rounded">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-green-50 text-green-500 text-sm rounded-md hover:bg-green-100"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 bg-gray-50 text-gray-500 text-sm rounded-md hover:bg-gray-100"
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleOpenModal("guide")}
                    className="px-3 py-1 bg-gray-50 text-gray-500 text-sm rounded-md hover:bg-gray-200"
                  >
                    도움말
                  </button>
                  <button
                    onClick={() => handleOpenModal("template")}
                    className="px-3 py-1 bg-gray-50 text-gray-500 text-sm rounded-md hover:bg-gray-200"
                  >
                    템플릿
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1 bg-blue-50 text-blue-500 text-sm rounded-md hover:bg-blue-100"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleCategoryDelete}
                    className="px-3 py-1 bg-red-50 text-red-500 text-sm rounded-md hover:bg-red-100"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        {modalState.isOpen && (
          <Modal onClose={modalState.onClose2}>
            <AlertModal
              title={modalState.title}
              onClick={modalState.onClose}
              btnText={modalState.btnText}
            />
          </Modal>
        )}
      </li>
    </>
  );
};

export default SortableItem;

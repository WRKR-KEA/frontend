"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import GuideModal from "./GuideModal"; // ✅ 도움말 모달
import TemplateModal from "./TemplateModal"; // ✅ 템플릿 모달
import Modal from "@/components/Modals/Modal";
import AlertModal from "@/components/Modals/AlertModal";
interface SortableItemProps {
  categoryId: number;
  name: string;
  onEdit: (newName: string) => void;
  onDelete: () => void;
  refetch: () => void;
  refetchList: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  categoryId,
  name,
  onEdit,
  onDelete,
  refetch,
  refetchList,
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
  const [editValue, setEditValue] = useState(name);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"guide" | "template" | null>(null); // ✅ 모달 타입 추가
  const [modalTitle, setModalTitle] = useState("");

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText:'',
    onClose: () => {},
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
    });
  };
  

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  // ✅ 카테고리 수정 함수
  const handleSave = async () => {
    if (!editValue.trim()) {
      showModal("이름을 입력해주세요.");
      return;
    }

    try {
      const accessToken = sessionStorage.getItem("accessToken");

      const response = await fetch(
        `http://172.16.211.53:8080/api/admin/categories/${categoryId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ name: editValue.trim() }),
        }
      );

      if (!response.ok) {
        throw new Error("카테고리 수정 실패");
      }

      showModal("카테고리가 성공적으로 수정되었습니다.");
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("❌ 카테고리 수정 오류:", error);
      showModal("카테고리를 수정하는 중 오류가 발생했습니다.");
    }
  };

  // ✅ 카테고리 삭제 함수
  const handleCategoryDelete = async () => {
    if (!confirm("정말 이 카테고리를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const accessToken = sessionStorage.getItem("accessToken");

      const response = await fetch(
        `http://172.16.211.53:8080/api/admin/categories/${categoryId}`,
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
        refetch(); // ✅ 모달이 닫힌 후 refetch 실행
      });
    } catch (error) {
      console.error("❌ 카테고리 삭제 오류:", error);
      showModal("카테고리를 삭제하는 중 오류가 발생했습니다.");
    }
  };

  // ✅ 모달 열기 함수 (도움말 / 템플릿)
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
            refetchList={refetchList}
          />
        )}

        {isModalOpen && modalType === "template" && (
          <TemplateModal
            categoryId={categoryId.toString()}
            isOpen={isModalOpen}
            title={modalTitle}
            onClose={handleCloseModal}
            onSave={handleCloseModal}
            refetchList={refetchList}
            showModal={showModal}
          
          />
        )}

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div {...attributes} {...listeners} className="">
              <img src="/hamburg.png" alt="drag" className="w-5 cursor-grab" />
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="border rounded px-2 py-1 text-gray-700"
                autoFocus
              />
            ) : (
              <span className="text-lg font-semibold text-gray-700 pointer-events-none">
                {name}
              </span>
            )}
          </div>

          {/* ✅ 모달이 열려있지 않을 때만 버튼 표시 */}
          {isHovered && !isDragging && !isModalOpen && (
            <div className="absolute right-4 flex space-x-2 bg-white p-1 rounded shadow-md">
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
                    className="px-3 py-1 bg-gray-50 text-gray-500 text-sm rounded-md hover:bg-gray-100"
                  >
                    도움말
                  </button>
                  <button
                    onClick={() => handleOpenModal("template")}
                    className="px-3 py-1 bg-gray-50 text-gray-500 text-sm rounded-md hover:bg-gray-100"
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
          <Modal onClose={modalState.onClose}>
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

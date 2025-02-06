"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  categoryId: number;
  name: string;
  onEdit: (newName: string) => void;
  onDelete: () => void;
  onTemplate: () => void;
  onHelp: () => void;
  refetch: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  categoryId,
  name,
  onEdit,
  onDelete,
  onTemplate,
  onHelp,
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
  const [editValue, setEditValue] = useState(name);
  const [isHovered, setIsHovered] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  // ✅ 카테고리 수정 함수
  const handleSave = async () => {
    if (!editValue.trim()) {
      alert("이름을 입력해주세요.");
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

      alert("카테고리가 성공적으로 수정되었습니다.");
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("❌ 카테고리 수정 오류:", error);
      alert("카테고리를 수정하는 중 오류가 발생했습니다.");
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

      alert("카테고리가 성공적으로 삭제되었습니다.");
      refetch();
    } catch (error) {
      console.error("❌ 카테고리 삭제 오류:", error);
      alert("카테고리를 삭제하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <li
      ref={setNodeRef} // ✅ `li` 요소에 `setNodeRef` 적용
      style={style}
      className="bg-gray-50 border border-gray-200 rounded-md hover:shadow transition-shadow relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <div {...attributes} {...listeners} className="cursor-grab">
            <img src="/hamburg.png" alt="drag" className="w-5" />
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

        {isHovered && !isDragging && (
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
                  onClick={onHelp}
                  className="px-3 py-1 bg-gray-50 text-gray-500 text-sm rounded-md hover:bg-gray-100"
                >
                  도움말
                </button>
                <button
                  onClick={onTemplate}
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
    </li>
  );
};

export default SortableItem;

// CategoryManagement.tsx
'use client';

import React, { useState } from "react";
import Modal from "./Modal";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Category {
  id: number;
  name: string;
}

const SortableItem: React.FC<{
  id: number;
  name: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onEdit: (newName: string) => void;
  onDelete: () => void;
  onTemplate: () => void;
  onHelp: () => void;
}> = ({
  id,
  name,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onEdit,
  onDelete,
  onTemplate,
  onHelp,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(editValue.trim());
      setIsEditing(false);
    } else {
      alert("이름을 입력해주세요.");
    }
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 border border-gray-200 rounded-md hover:shadow transition-shadow relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <div {...attributes} {...listeners}>
            <img src="/hamburg.png" alt="drag" className="w-5" />
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="border rounded px-2 py-1 text-gray-700"
            />
          ) : (
            <span className="text-lg font-semibold text-gray-700 pointer-events-none">
              {name}
            </span>
          )}
        </div>

        {isHovered && !isDragging && (
          <div className="absolute right-4 flex space-x-2">
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
                  onClick={onDelete}
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

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "인프라 (Infrastructure)" },
    { id: 2, name: "시스템 (System)" },
    { id: 3, name: "네트워크 (Network)" },
  ]);

  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const handleAddCategory = () => {
    const newName = prompt("새로운 카테고리 이름을 입력하세요:");
    if (newName) {
      setCategories((prev) => [
        ...prev,
        { id: prev.length + 1, name: newName },
      ]);
    }
  };

  const handleEditCategory = (id: number, newName: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, name: newName } : category
      )
    );
  };

  const handleDeleteCategory = (id: number) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  const openModal = (title: string, content: string) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveModal = () => {
    // 모달 저장 로직
  };

  return (
    <div className="bg-gray-100 h-full py-10 px-6">
      <Modal
        isOpen={isModalOpen}
        title={modalContent.title}
        content={modalContent.content}
        onClose={closeModal}
        onSave={saveModal}
      />
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">카테고리 관리</h1>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={categories.map((category) => category.id)}>
            <ul className="space-y-4">
              {categories.map((category) => (
                <SortableItem
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  isHovered={hoveredCategory === category.id}
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onEdit={(newName) => handleEditCategory(category.id, newName)}
                  onDelete={() => handleDeleteCategory(category.id)}
                  onTemplate={() =>
                    openModal(
                      `${category.name} 템플릿`,
                      `${category.name} 템플릿에 대한 설명입니다.`
                    )
                  }
                  onHelp={() =>
                    openModal(
                      `${category.name} 도움말`,
                      `${category.name} 도움말 내용입니다.`
                    )
                  }
                />
              ))}
            </ul>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <div
                className="bg-gray-50 border border-gray-200 rounded-md hover:shadow transition-shadow p-4 flex items-center space-x-4"
                style={{ opacity: 1 }}
              >
                <img src="/hamburg.png" alt="drag" className="w-5" />
                <span className="text-lg font-semibold text-gray-700">
                  {categories.find((category) => category.id === activeId)?.name}
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
        <button
          className="w-full mt-6 px-6 py-4 bg-gray-500 text-white text-sm font-semibold rounded-md hover:bg-gray-600 transition-all shadow-sm"
          onClick={handleAddCategory}
        >
          카테고리 추가
        </button>
      </div>
    </div>
  );
};

export default CategoryManagement;
"use client";

import React, { useState } from "react";

interface Category {
  id: number;
  name: string;
  count: number;
  subCategories: string[];
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "인프라 (Infrastructure)", count: 5, subCategories: [] },
    { id: 2, name: "시스템 (System)", count: 4, subCategories: [] },
    { id: 3, name: "네트워크 (Network)", count: 3, subCategories: ["VPC", "Load Balancing", "DNS"] },
    { id: 4, name: "기타", count: 3, subCategories: [] },
  ]);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const toggleCategory = (id: number) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const handleAddSubCategory = (categoryId: number) => {
    const subCategoryName = prompt("추가할 서브 카테고리 이름을 입력하세요:");
    if (subCategoryName) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                subCategories: [...category.subCategories, subCategoryName],
              }
            : category
        )
      );
    }
  };

  const handleEditCategory = (categoryId: number) => {
    const newName = prompt("카테고리 이름을 수정하세요:");
    if (newName) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId ? { ...category, name: newName } : category
        )
      );
    }
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (confirm("정말로 이 카테고리를 삭제하시겠습니까?")) {
      setCategories((prev) => prev.filter((category) => category.id !== categoryId));
    }
  };

  const handleDeleteSubCategory = (categoryId: number, subCategoryIndex: number) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              subCategories: category.subCategories.filter((_, index) => index !== subCategoryIndex),
            }
          : category
      )
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-lg font-bold mb-4">카테고리 관리</h1>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id} className="bg-gray-50 border rounded-md">
              {/* 1차 카테고리 */}
              <div
                className="flex items-center justify-between p-4 relative group"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-8 bg-yellow-300 rounded-sm"></div>
                  <span>
                    {category.name} ({category.count})
                  </span>
                </div>
                <button className="text-gray-500">
                  {expandedCategory === category.id ? "▼" : "▶"}
                </button>
                {/* Hover 시 추가/수정/삭제 버튼 */}
                <div className="absolute right-4 hidden group-hover:flex space-x-2">
                  <button
                    onClick={() => handleAddSubCategory(category.id)}
                    className="px-2 py-1 bg-gray-200 text-sm rounded-md hover:bg-gray-300"
                  >
                    추가
                  </button>
                  <button
                    onClick={() => handleEditCategory(category.id)}
                    className="px-2 py-1 bg-gray-200 text-sm rounded-md hover:bg-gray-300"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="px-2 py-1 bg-gray-200 text-sm rounded-md hover:bg-gray-300"
                  >
                    삭제
                  </button>
                </div>
              </div>
              {/* 2차 카테고리 */}
              {expandedCategory === category.id && (
                <div className="pl-10 pr-4 py-2">
                  <ul className="space-y-2">
                    {category.subCategories.map((subCategory, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md relative group"
                      >
                        <span>{subCategory}</span>
                        {/* Hover 시 수정/삭제 버튼 */}
                        <div className="absolute right-4 hidden group-hover:flex space-x-2">
                          <button className="px-2 py-1 bg-gray-200 text-sm rounded-md hover:bg-gray-300">
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteSubCategory(category.id, index)}
                            className="px-2 py-1 bg-gray-200 text-sm rounded-md hover:bg-gray-300"
                          >
                            삭제
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
        <button
          className="w-full mt-4 px-4 py-2 bg-gray-200 text-sm rounded-md hover:bg-gray-300"
          onClick={() => alert("카테고리 추가 기능")}
        >
          + 카테고리 추가
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          변경사항 저장하기
        </button>
      </div>
    </div>
  );
};

export default CategoryManagement;

"use client";

import React, { useState } from "react";

interface AdminMemberDetailProps {
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  tasks: string[];
  avatar: string;
}

const AdminMemberDetailPage: React.FC<AdminMemberDetailProps> = ({
  name = "감만세",
  email = "wrkr@kakao.crop",
  phone = "01012345678",
  department = "인프라",
  position = "팀장",
  tasks = ["AWS", "스토리지", "VM 인스턴스"],
  avatar = "/profile.jpg",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({
    name,
    email,
    phone,
    department,
    position,
    tasks,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

  const categories: { [key: string]: string[] } = {
    클라우드: ["AWS", "Azure", "GCP"],
    스토리지: ["NAS", "SAN", "Object Storage"],
    네트워크: ["Firewall", "Router", "Switch"],
  };

  const handleAddTask = (): void => {
    if (selectedSubCategory && !editableData.tasks.includes(selectedSubCategory)) {
      setEditableData((prev) => ({
        ...prev,
        tasks: [...prev.tasks, selectedSubCategory],
      }));
      setSelectedSubCategory("");
    }
  };

  const handleSave = (): void => {
    setIsEditing(false);
    console.log("Updated Data:", editableData);
  };

  return (
    <div className="bg-gray-50 flex justify-center p-8">
      <div className="bg-white shadow-md rounded-lg p-12 w-full max-w-4xl">
        {/* 프로필 헤더 */}
        <div className="flex items-center space-x-6 border-b pb-6">
          <div className="relative">
            <img
              src="/adminProfile.png"
              alt={editableData.name}
              className="w-32 h-32 rounded-full object-cover"
            />
           
          </div>
          <div className="w-full">
            {isEditing ? (
              <input
                type="text"
                value={editableData.name}
                onChange={(e) =>
                  setEditableData({ ...editableData, name: e.target.value })
                }
                className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 focus:outline-none w-full"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300">
                {editableData.name}
              </h1>
            )}
            <div className="flex items-center text-gray-500 mt-2">
              <span>담당자</span>
            </div>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="grid grid-cols-2 gap-6 mt-6 text-gray-700">
          <div>
            <h2 className="text-sm font-semibold text-gray-500">이메일 주소</h2>
            {isEditing ? (
              <input
                type="email"
                value={editableData.email}
                onChange={(e) =>
                  setEditableData({ ...editableData, email: e.target.value })
                }
                className="w-full border-b-2 border-gray-300 px-2 py-1 focus:outline-none"
              />
            ) : (
              <a href={`mailto:${editableData.email}`} className="text-blue-500">
                {editableData.email}
              </a>
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500">전화번호</h2>
            {isEditing ? (
              <input
                type="tel"
                value={editableData.phone}
                onChange={(e) =>
                  setEditableData({ ...editableData, phone: e.target.value })
                }
                className="w-full border-b-2 border-gray-300 px-2 py-1 focus:outline-none"
              />
            ) : (
              <p>{editableData.phone}</p>
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500">부서</h2>
            {isEditing ? (
              <input
                type="text"
                value={editableData.department}
                onChange={(e) =>
                  setEditableData({ ...editableData, department: e.target.value })
                }
                className="w-full border-b-2 border-gray-300 px-2 py-1 focus:outline-none"
              />
            ) : (
              <p>{editableData.department}</p>
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500">직책</h2>
            {isEditing ? (
              <input
                type="text"
                value={editableData.position}
                onChange={(e) =>
                  setEditableData({ ...editableData, position: e.target.value })
                }
                className="w-full border-b-2 border-gray-300 px-2 py-1 focus:outline-none"
              />
            ) : (
              <p>{editableData.position}</p>
            )}
          </div>
        </div>

        {/* 담당업무 */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-500">담당업무</h2>
          <div className="flex space-x-2 mt-2">
            {editableData.tasks.map((task, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-[#F4D35E] text-white text-sm font-semibold rounded-full"
              >
                {task}
              </span>
            ))}
          </div>

          {isEditing && (
            <div className="mt-4 space-y-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border-b-2 border-gray-300 px-4 py-2 w-full focus:outline-none"
              >
                <option value="">1차 카테고리 선택</option>
                {Object.keys(categories).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {selectedCategory && (
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="border-b-2 border-gray-300 px-4 py-2 w-full focus:outline-none"
                >
                  <option value="">2차 카테고리 선택</option>
                  {categories[selectedCategory].map((subCategory) => (
                    <option key={subCategory} value={subCategory}>
                      {subCategory}
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
              >
                추가
              </button>
            </div>
          )}
        </div>

        {/* 수정/저장 버튼 */}
        <div className="mt-6 flex justify-center">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600"
            >
              저장
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-300"
            >
              수정
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMemberDetailPage;

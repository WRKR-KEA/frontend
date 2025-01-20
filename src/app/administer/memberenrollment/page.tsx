"use client";

import React, { useState } from "react";

const AdminMemberEnrollPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    department: "",
    phone: "",
    position: "",
    role: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // 여기에 제출 처리 로직 추가
  };

  return (
    <div className="bg-gray-50 flex justify-center p-8">
      <div className="bg-white shadow-md rounded-lg p-12 w-full max-w-4xl">
        {/* 헤더 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          회원 등록
        </h1>

        {/* 회원 등록 폼 */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* 이름 */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              이름
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          {/* 이메일 주소 */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              이메일 주소
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
              placeholder="이메일 주소를 입력하세요"
              required
            />
          </div>

          

          {/* 부서 */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              부서
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
              placeholder="부서를 입력하세요"
              required
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              전화번호
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
              placeholder="전화번호를 입력하세요"
              required
            />
          </div>

          {/* 직책 */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              직책
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
              placeholder="직책을 입력하세요"
              required
            />
          </div>

          {/* 권한 */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              권한
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
              required
            >
              <option value="">권한을 선택하세요</option>
              <option value="manager">담당자</option>
              <option value="user">사용자</option>
            </select>
          </div>

          {/* 등록 버튼 */}
          <div className="col-span-2 mt-8">
            <button
              type="submit"
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-300"
            >
              회원 등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminMemberEnrollPage;

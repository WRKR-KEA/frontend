"use client";

import { useState } from "react";
import ProfileSave from "@/components/profileSave";
import ProfileManagerEdit from "@/components/profileManagerEdit"; 

export default function ManagerProfilePage() {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State to track if the Manager is editing
  
  // 프로필 정보
  const profile = {
    name: "춘식이",
    position: "직무",
    email: "choonsik@example.com",
    phone: "010-0000-0000",
    department: "카카오프렌즈",
    role: "사원",
    permission: "권한",
  };

  const toggleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing); // Toggle between edit/save mode
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: "#FFE9B6",
          flex: "30%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></div>

      <div
        style={{
          background: "white",
          flex: "70%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "20px",
          position: "relative",
        }}
      >
        {/* 이메일 아이콘 */}
        <img
          src="/email.png"
          alt="Email Icon"
          style={{
            position: "absolute",
            top: "-30px",
            right: "5px",
            width: "30px",
            height: "30px",
            cursor: "pointer",
          }}
          onClick={toggleDropdown}
        />

        {/* 이메일 드롭다운 */}
        {isDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "0",
              right: "5px",
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "10px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
            }}
          >
            <label style={{ display: "flex", alignItems: "center" }}>
              이메일 수신 동의
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={toggleEmailNotifications}
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>
        )}

        {/* 프로필 이미지 */}
        <img
          src="/profile.png"
          alt="Profile"
          style={{
            borderRadius: "50%",
            marginBottom: "20px",
            width: "250px",
            height: "250px",
            marginTop: "-270px",
          }}
        />

        {/* Conditionally render ProfileSave or ProfileManagerEdit */}
        {isEditing ? (
          <ProfileManagerEdit profile={profile} />
        ) : (
          <ProfileSave profile={profile} />
        )}

        {/* Edit/Save Button */}
        <button
          style={{
            marginTop: "50px",
            padding: "10px 50px",
            background: "#FFE9B6",
            color: "black",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={toggleEditing} // Toggle between Edit and Save
        >
          {isEditing ? "저장" : "수정"} {/* Change text based on edit mode */}
        </button>
      </div>
    </div>
  );
}
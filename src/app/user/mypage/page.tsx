"use client";

import { useEffect, useState } from "react";
import { fetchMyPage, updateMyPage } from "@/service/user";
import ProfileSave from "@/components/Profiles/profileSave";
import ProfileEdit from "@/components/Profiles/profileEdit";
import useUserStore from "@/stores/userStore"; 

export default function UserProfilePage() {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 상태
  const [profile, setProfile] = useState<any>(null); // 상태로 프로필 데이터 저장
  const user = useUserStore((state) => state.user);
  console.log("현재 로그인된 유저 정보:", user);

  useEffect(() => {
    const memberId = user?.name;
    if (!memberId) return; 
  
    fetchMyPage(memberId)
      .then((data) => {
        setProfile(data.result);
        console.log("data", data.result);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  const toggleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing); // 편집 모드 전환
  };

  const saveProfile = async () => {
    if (profile) {
      const updateData = {
        position: profile.position,
        phone: profile.phone,
      };

      try {
        await updateMyPage(profile.memberId, updateData); 
        alert("프로필이 저장되었습니다."); // 성공 메시지
        console.log(updateData);
        setIsEditing(false); // 편집 모드 종료
      } catch (error) {
        console.error("프로필 저장 실패", error);
        alert("프로필 저장에 실패했습니다."); // 실패 메시지
      }
    }
  };

  if (!profile) {
    return <div>Loading...</div>; // 프로필 데이터가 로딩 중일 때
  }

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
          src={profile.profileImage || "/profile.png"}
          alt="Profile"
          style={{
            borderRadius: "50%",
            marginBottom: "20px",
            width: "250px",
            height: "250px",
            marginTop: "-270px",
          }}
        />

        {/* 프로필 정보 */}
        {isEditing ? (
          <ProfileEdit profile={profile} />
        ) : (
          <ProfileSave profile={profile} />
        )}

        {/* Edit 버튼 (편집 모드로 전환) */}
        {!isEditing && (
          <button
            style={{
              marginTop: "50px",
              padding: "10px 50px",
              background: "#FFE9B6",
              color: "black",
              border: "none",
              borderRadius: "5px",
            }}
            onClick={toggleEditing} // 수정 버튼 클릭 시 편집 모드 전환
          >
            수정
          </button>
        )}

        {/* Save 버튼 (편집 후 저장) */}
        {isEditing && (
          <button
            style={{
              marginTop: "50px",
              padding: "10px 50px",
              background: "#FFE9B6",
              color: "black",
              border: "none",
              borderRadius: "5px",
            }}
            onClick={saveProfile} // 저장 버튼 클릭 시 프로필 저장
          >
            저장
          </button>
        )}
      </div>
    </div>
  );
}
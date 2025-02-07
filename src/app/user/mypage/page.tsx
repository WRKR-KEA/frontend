"use client";

import { useEffect, useState } from "react";
import { fetchMyPage, updateMyPage } from "@/service/user";
import ProfileSave from "@/components/Profiles/profileSave";
import ProfileEdit from "@/components/Profiles/profileEdit";
import AlertModal from "@/components/Modals/AlertModal";
import Modal from "@/components/Modals/Modal";

export default function UserProfilePage() {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [profile, setProfile] = useState<any>(null); 
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText:'',
    onClose: () => {},    
  });

  const showModal = (title: string, btnText='닫기') => {
    setModalState({
      isOpen: true,
      title,
      btnText,
      onClose: () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
      },
   
    });
  };

  useEffect(() => {
    fetchMyPage()
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
    setIsEditing(!isEditing); 
  };

  const saveProfile = async () => {
    if (profile) {
      const updateData = {
        position: profile.position,
        phone: profile.phone,
      };
  
      try {
        await updateMyPage(updateData); 
        showModal("프로필이 저장되었습니다."); // 성공 메시지
        console.log(updateData);
        setIsEditing(false); // 편집 모드 종료
      } catch (error) {
        console.error("프로필 저장 실패", error);
        showModal("프로필 저장에 실패했습니다.");
      }
    }
  };

  if (!profile) {
    return <div>로딩 중...</div>; // 프로필 데이터가 로딩 중일 때
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
          <ProfileEdit profile={profile} setProfile={setProfile} />
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
}
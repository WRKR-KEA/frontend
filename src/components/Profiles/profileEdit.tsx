import { useState } from "react";

type Profile = {
    agitNotification: boolean;
    agitURL: string;
    email: string;
    emailNotification: boolean;
    memebrId: string;
    name: string;
    nickname: string;
    phone: string;
    position: string;
    profileImage: string;
    role: string;
    serviceNotification: boolean;
  };
  
  function ProfileEdit({ profile }: { profile: Profile }) {
    const [editableProfile, setEditableProfile] = useState(profile);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Profile) => {
      setEditableProfile({
        ...editableProfile,
        [field]: e.target.value,
      });
    };
  
    return (
      <div>
        {/* 프로필 정보 */}
        <h1
          style={{
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {editableProfile.name}
        </h1>
        {/* 수정 가능한 폼 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* 이메일과 부서를 수평으로 배치 */}
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: "0.8rem",
                  color: "#777",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                이메일
              </label>
              <input
                type="text"
                value={editableProfile.email}
                readOnly // 이메일은 클릭할 수 없도록 읽기 전용
                style={{
                  background: "#ddd", // 비활성화 시 회색 배경
                  border: "none",
                  padding: "10px",
                  borderRadius: "5px",
                  width: "100%",
                }}
              />
            </div>
  
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: "0.8rem",
                  color: "#777",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                닉네임
              </label>
              <input
                type="text"
                value={editableProfile.nickname}
                readOnly // 닉네임도 수정할 수 없도록 읽기 전용
                style={{
                  background: "#ddd", // 비활성화 시 회색 배경
                  border: "none",
                  padding: "10px",
                  borderRadius: "5px",
                  width: "100%",
                }}
              />
            </div>
          </div>
  
          {/* 직책과 전화번호 수평 배치 */}
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: "0.8rem",
                  color: "#777",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                직책
              </label>
              <input
                type="text"
                value={editableProfile.position}
                onChange={(e) => handleChange(e, 'position')} // 직책 수정 처리
                style={{
                  background: "#FAF0CA", // 수정 가능 시 강조 색상
                  border: "1px solid #ddd",
                  padding: "10px",
                  borderRadius: "5px",
                  width: "100%",
                }}
              />
            </div>
  
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: "0.8rem",
                  color: "#777",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                전화번호
              </label>
              <input
                type="text"
                value={editableProfile.phone}
                onChange={(e) => handleChange(e, 'phone')} // 전화번호 수정 처리
                style={{
                  background: "#FAF0CA", // 수정 가능 시 강조 색상
                  border: "1px solid #ddd",
                  padding: "10px",
                  borderRadius: "5px",
                  width: "100%",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default ProfileEdit;
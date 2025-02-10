import { useEffect,useState } from "react";

type Profile = {
    name: string;
    department: string;
    role: string;
    permission: string;
    position: string;
    email: string;
    phone: string;
  };
  
   function ProfileManagerEdit({ profile, setProfile }: { profile: Profile; setProfile: React.Dispatch<React.SetStateAction<Profile>> }) {
      const [editableProfile, setEditableProfile] = useState(profile);
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Profile) => {
        setEditableProfile({
          ...editableProfile,
          [field]: e.target.value,
        });
      };
    
      useEffect(() => {
        setProfile(editableProfile);
      }, [editableProfile, setProfile]);
    
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
          {profile.name}
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
                value={profile.email}
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
                부서
              </label>
              <input
                type="text"
                value={profile.department}
                readOnly // 부서도 수정할 수 없도록 읽기 전용
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
                권한
              </label>
              <input
                type="text"
                value={profile.permission}
                readOnly // 부서도 수정할 수 없도록 읽기 전용
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
                value={profile.role}
                onChange={(e) =>handleChange(e, 'role')} 
                style={{
                  background: "#FAF0CA", 
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
                value={profile.phone}
                onChange={(e) => handleChange(e, 'phone')}  // You can handle the value update here
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
                담당업무
              </label>
              <input
                type="text"
                value={profile.position}
                onChange={(e) => handleChange(e, 'position')} 
                style={{
                  background: "#FAF0CA", 
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
  
  export default ProfileManagerEdit;
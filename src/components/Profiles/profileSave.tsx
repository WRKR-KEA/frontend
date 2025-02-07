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
  
  function ProfileSave({ profile }: { profile: Profile }) {
    return (
      <div>
        {/* 프로필 정보 */}
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          {profile.name}
        </h1>
        {/* <p style={{ textAlign: "center" }}>{profile.position}</p> */}
        <p style={{ textAlign: "center" }}>
            {profile.email} / {profile.phone}
        </p> 

        {/* 프로필 세부 정보 */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "40px",
            marginBottom: "16px",
          }}
        >
          {/* 첫 번째 항목 */}
          <div
            style={{
              width: "200px", // 고정된 너비
              textAlign: "center", // 가운데 정렬
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {profile.position}
          </div>
  
          {/* 세로 구분선 */}
          <div
            style={{
              height: "40px",
              borderLeft: "2px solid #ccc",
              margin: "0 20px",
            }}
          ></div>
  
          {/* 두 번째 항목 */}
          <div
            style={{
              width: "200px", // 고정된 너비
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {profile.role}
          </div>
  
          {/* 세로 구분선 */}
          <div
            style={{
              height: "40px",
              borderLeft: "2px solid #ccc",
              margin: "0 20px",
            }}
          ></div>
  
          {/* 세 번째 항목 */}
          <div
            style={{
              width: "200px", // 고정된 너비
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {profile.nickname}
          </div>
        </div>
      </div>
    );
  }
  
  export default ProfileSave;
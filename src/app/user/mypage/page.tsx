"use client"; // 클라이언트 컴포넌트로 지정

import { useState } from 'react';

export default function UserProfilePage() {
    // 데이터 상태 관리
    const [emailNotifications, setEmailNotifications] = useState(false);

    // 프로필 정보
    const profile = {
        name: "춘식이",
        position: "한컴 타자 (권한)",
        email: "choonsik@example.com",
        phone: "010-0000-0000",
        department: "카카오프렌즈",
        role: "사원",
        permission: "미정"
    };

    const toggleEmailNotifications = () => {
        setEmailNotifications(!emailNotifications);
    };

    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column' 
        }}>
            <div style={{ 
                background: '#f5f5dc', 
                flex: '30%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
            }}>
            </div>

            <div style={{ 
                background: 'white', 
                flex: '70%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                flexDirection: 'column',
                padding: '20px' 
            }}>
                {/* 프로필 이미지 상단 여백을 줄여서 위치를 올림 */}
                <img
                    src="/profile.png" 
                    alt="Profile"
                    style={{ 
                        borderRadius: '50%', 
                        marginBottom: '20px', 
                        width: '250px', 
                        height: '250px', 
                        marginTop: '-250px'  // 이미지 상단 위치를 위로 올림
                    }}
                />
                <h1>{profile.name}</h1>
                <p>{profile.position}</p>
                <p>컨택은 {profile.email} 또는 {profile.phone}</p>
                <p>감사합니다. (이메일, 전화번호)</p>
                <div style={{ margin: '20px 0' }}>
                    <span>{profile.department}</span> | <span>{profile.role}</span> | <span>{profile.permission}</span>
                </div>
                <div style={{ margin: '20px 0' }}>
                    <label>
                        이메일 수신 동의
                        <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={toggleEmailNotifications}
                            style={{ marginLeft: '10px' }}
                        />
                    </label>
                </div>
                <button style={{ 
                    padding: '10px 20px', 
                    background: '#4CAF50', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px' 
                }}>
                    수정
                </button>
            </div>
        </div>
    );
}
"use client"; // 클라이언트 컴포넌트로 지정

import { useState } from 'react';

export default function UserProfilePage() {
    const [emailNotifications, setEmailNotifications] = useState(false);

    const toggleEmailNotifications = () => {
        setEmailNotifications(!emailNotifications);
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center', background: '#f5f5dc' }}>
            <img
                src="https://via.placeholder.com/100" // 프로필 이미지 URL
                alt="Profile"
                style={{ borderRadius: '50%', marginBottom: '20px' }}
            />
            <h1>춘식이</h1>
            <p>한컴 타자 (권한)</p>
            <p>컨택은 choonsik@example.com 또는 010-0000-0000</p>
            <p>감사합니다. (이메일, 전화번호)</p>
            <div style={{ margin: '20px 0' }}>
                <span>카카오프렌즈</span> | <span>사원</span> | <span>미정</span>
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
            <button style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
                수정
            </button>
        </div>
    );
}

"use client"; // 클라이언트 컴포넌트로 지정

import { useState } from 'react';

export default function UserCreateTicketPage() {
    const [selectedService, setSelectedService] = useState('Hadoop');
    const [selectedRequestType, setSelectedRequestType] = useState('');

    const services = [
        'Database (DB)',
        'Virtual Machine (VM)',
        'Monitoring & Logging',
        'Hadoop',
        'Kubernetes (K8s)',
        'Cloud Storage',
        'Networking',
        '기타',
    ];

    const requestTypes = [
        '요청 타입을 선택해주세요',
        '타입1',
        '타입2',
        '타입3',
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>티켓 생성</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <label>업무 분류</label>
                    <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        style={{ marginLeft: '10px' }}
                    >
                        {services.map((service) => (
                            <option key={service} value={service}>
                                {service}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>업무</label>
                    <select
                        value={selectedRequestType}
                        onChange={(e) => setSelectedRequestType(e.target.value)}
                        style={{ marginLeft: '10px' }}
                    >
                        {requestTypes.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

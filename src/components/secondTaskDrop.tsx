"use client"; // 클라이언트 컴포넌트로 지정

interface SecondTaskDropProps {
    selectedRequestType: string;
    onRequestTypeChange: (value: string) => void;
}

export default function SecondTaskDrop({ selectedRequestType, onRequestTypeChange }: SecondTaskDropProps) {
    const requestTypes = [
        "타입1",
        "타입2",
        "타입3",
    ];

    return (
        <div style={{ marginTop: "5px" }}>
            <select
                value={selectedRequestType}
                onChange={(e) => onRequestTypeChange(e.target.value)}
                style={{
                    width: "100%", // 드롭다운 폭을 100%로 설정하여 부모 요소에 맞추기
                }}
            >
                {requestTypes.map((type, index) => (
                    <option key={index} value={type}>
                        {type}
                    </option>
                ))}
            </select>
        </div>
    );
}
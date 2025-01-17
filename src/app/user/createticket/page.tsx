"use client"; 

import { useState } from "react";
import FirstTaskDrop from "../../../components/firstTaskDrop";
import SecondTaskDrop from "../../../components/secondTaskDrop";

export default function UserCreateTicketPage() {
    const [selectedService, setSelectedService] = useState<string>("1차 카테고리를 선택해주세요.");
    const [selectedRequestType, setSelectedRequestType] = useState<string>("2차 카테고리를 선택해주세요.");

    // Handler function to update selectedService
    const handleServiceChange = (value: string) => {
        setSelectedService(value);
    };

    // Handler function to update selectedRequestType
    const handleRequestTypeChange = (value: string) => {
        setSelectedRequestType(value);
    };

    return (
        <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
            <h2 className="text-md font-semibold w-60">티켓 생성</h2>
            <div className="flex space-x-0 mb-5">
                {/* 업무 분류 및 드롭다운 */}
                <div className="flex flex-col items-start ml-8 w-80">
                    <label>업무 분류</label>
                    <FirstTaskDrop
                        selectedService={selectedService}
                        onServiceChange={handleServiceChange} 
                    />
                </div>

                {/* 업무 및 드롭다운 */}
                <div className="flex flex-col items-start">
                    <label>업무</label>
                    <SecondTaskDrop
                        selectedRequestType={selectedRequestType}
                        onRequestTypeChange={handleRequestTypeChange} 
                    />
                </div>
            </div>
        </div>
    );
}
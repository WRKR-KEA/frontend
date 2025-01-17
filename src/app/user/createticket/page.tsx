"use client"; 

import { useState } from "react";
import FirstTaskDrop from "../../../components/firstTaskDrop";
import SecondTaskDrop from "../../../components/secondTaskDrop";
import Help from "../../../components/Help"; 
import Modal from "../../../components/Modal"; 

export default function UserCreateTicketPage() {
  const [selectedService, setSelectedService] = useState<string>("1차 카테고리를 선택해주세요.");
  const [selectedRequestType, setSelectedRequestType] = useState<string>("2차 카테고리를 선택해주세요.");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility

  // Handler function to update selectedService
  const handleServiceChange = (value: string) => {
    setSelectedService(value);
  };

  // Handler function to update selectedRequestType
  const handleRequestTypeChange = (value: string) => {
    setSelectedRequestType(value);
  };

  // Function to toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-md font-semibold w-60 mb-4">티켓 생성</h2>
        <button
          className="flex items-center justify-center space-x-2 text-[#6E61CA] hover:text-[#5A50A8]"
          onClick={toggleModal}
        >
          <span className="text-sm font-medium">도움말</span>
          <img
          src="/helpIcon.png"
          alt="Help Icon"
          className="w-4 h-4"
        />
        </button>
      </div>

      <div className="flex space-x-0 mb-5">
        {/* 업무 분류 및 드롭다운 */}
        <div className="flex flex-col items-start ml-8 mr-16 w-80">
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
            selectedService={selectedService} 
          />
        </div>
      </div>

      {/* Modal for help */}
      {isModalOpen && (
        <Modal onClose={toggleModal}>
          <Help />
        </Modal>
      )}
    </div>
  );
}
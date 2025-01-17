"use client";

import { useState } from "react";
import FirstTaskDrop from "../../../components/firstTaskDrop";
import SecondTaskDrop from "../../../components/secondTaskDrop";
import Help from "../../../components/Help";
import Modal from "../../../components/Modal";
import SparkleButton from "../../../components/sparkleButton";
import Template from "../../../components/Template"; // Template.tsx 컴포넌트 불러오기

export default function UserCreateTicketPage() {
  const [selectedService, setSelectedService] = useState<string>("1차 카테고리를 선택해주세요.");
  const [selectedRequestType, setSelectedRequestType] = useState<string>("2차 카테고리를 선택해주세요.");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
  };

  const handleRequestTypeChange = (value: string) => {
    setSelectedRequestType(value);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCreate = () => {
    console.log("Ticket created!");
  };

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col min-h-screen justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-md font-semibold w-60 mb-4">티켓 생성</h2>
          <button
            className="flex items-center justify-center space-x-2 text-[#6E61CA] hover:text-[#5A50A8]"
            onClick={toggleModal}
          >
            <span className="text-sm font-medium">도움말</span>
            <img src="/helpIcon.png" alt="Help Icon" className="w-4 h-4" />
          </button>
        </div>

        <div className="flex space-x-0 mb-5">
          <div className="flex flex-col items-start ml-8 mr-16 w-80">
            <label>업무 분류</label>
            <FirstTaskDrop
              selectedService={selectedService}
              onServiceChange={handleServiceChange}
            />
          </div>

          <div className="flex flex-col items-start">
            <label>업무</label>
            <SecondTaskDrop
              selectedRequestType={selectedRequestType}
              onRequestTypeChange={handleRequestTypeChange}
              selectedService={selectedService}
            />
          </div>
        </div>
      </div>

      <Template />

      {isModalOpen && (
        <Modal onClose={toggleModal}>
          <Help />
        </Modal>
      )}

      {/* SparkleButton */}
      <div className="flex justify-center">
        <SparkleButton onClick={handleCreate}>생성하기</SparkleButton>
      </div>
    </div>
  );
}
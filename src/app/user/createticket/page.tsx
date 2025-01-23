"use client";

import { useState } from "react";
import FirstTaskDrop from "@/components/Tickets/firstTaskDrop";
import SecondTaskDrop from "@/components/Tickets/secondTaskDrop";
import Help from "@/components/Modals/Help";
import Modal from "@/components/Modals/Modal";
import SparkleButton from "@/components/Buttons/sparkleButton";
import Template from "@/components/Tickets/Template";
import Button from "@/components/Buttons/Button";

export default function UserCreateTicketPage() {
  const [selectedService, setSelectedService] = useState("1차 카테고리를 선택해주세요.");
  const [selectedRequestType, setSelectedRequestType] = useState("2차 카테고리를 선택해주세요.");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [helpContent, setHelpContent] = useState("");

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

  const updateHelpContent = (service: string) => {
    if (service !== "1차 카테고리를 선택해주세요.") {
      setHelpContent(`${service}`);
      setIsModalOpen(true);
    }
  };

  const isHelpButtonVisible = selectedService !== "1차 카테고리를 선택해주세요.";
  const isReadyToShow = selectedService !== "1차 카테고리를 선택해주세요." &&
                        selectedRequestType !== "2차 카테고리를 선택해주세요.";

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col min-h-screen justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-md font-semibold w-60 mb-4">티켓 생성</h2>
          {isHelpButtonVisible && (
            <button
              className="flex items-center justify-center space-x-2 text-[#6E61CA] hover:text-[#5A50A8]"
              onClick={() => updateHelpContent(selectedService)}
            >
              <span className="text-sm font-medium">도움말</span>
              <img src="/helpIcon.png" alt="Help Icon" className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex justify-center items-start space-x-16 mb-5">
          <div className="flex flex-col items-start w-80">
            <label>업무 분류</label>
            <FirstTaskDrop
              selectedService={selectedService}
              onServiceChange={handleServiceChange}
            />
          </div>

          <div className="flex flex-col items-start w-80">
            <label>업무</label>
            <SecondTaskDrop
              selectedRequestType={selectedRequestType}
              onRequestTypeChange={handleRequestTypeChange}
              selectedService={selectedService}
            />
          </div>
        </div>
      </div>

      {isReadyToShow && (
        <>
          <Template />
          <div className="flex justify-center">
            {/* <SparkleButton onClick={handleCreate}>생성하기</SparkleButton>  */}
            <Button label="작업 승인" onClick={handleCreate} color={1} />
          </div>
        </>
      )}

      {isModalOpen && (
        <Modal onClose={toggleModal}>
          <Help content={helpContent} />
        </Modal>
      )}
    </div>
  );
}
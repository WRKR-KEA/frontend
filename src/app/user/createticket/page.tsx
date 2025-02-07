"use client";

import { useEffect, useState } from "react";
import FirstTaskDrop from "@/components/Tickets/firstTaskDrop";
import SecondTaskDrop from "@/components/Tickets/secondTaskDrop";
import Help from "@/components/Modals/Help";
import Modal from "@/components/Modals/Modal";
import Template from "@/components/Tickets/Template";
import Button from "@/components/Buttons/Button";
import { createTicket } from "@/lib/api/userCreateTickets";
import { fetchCategories, fetchGuide, postTicket } from "@/services/user";
import { fetchTemplate } from "@/services/admin";

export default function UserCreateTicketPage() {
  const [selectedService, setSelectedService] = useState("1차 카테고리를 선택해주세요.");
  const [selectedRequestType, setSelectedRequestType] = useState("2차 카테고리를 선택해주세요.");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [helpTitle, setHelpTitle] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isTicketCreated, setIsTicketCreated] = useState(false); // 티켓 생성 여부
  const [categories, setCategories] = useState<any[]>([]);
  const [firstCategories, setFirstCategories] = useState<string[]>([]);
  const [secondCategories, setSecondCategories] = useState<any>();
  const [helpContent, setHelpContent] = useState("");

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
    setSecondCategories(categories.filter((category) => category.name === value)[0]);
  };

  const handleRequestTypeChange = (value: string) => {
    setSelectedRequestType(value);
    getTemplate(secondCategories?.categoryId);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  useEffect(() => {
      const loadCategories = async () => {
        try {
          const response = await fetchCategories();
          console.log("📌 가져온 카테고리 데이터:", response); // 응답 데이터 확인
    
          if (!response || typeof response !== "object") {
            console.error("⚠️ 잘못된 응답 형식:", response);
            setCategories([]); // 빈 배열로 초기화
            return;
          }
    
          if (!response.result || !Array.isArray(response.result.categories)) {
            console.error("⚠️ 'result' 필드가 없거나 배열이 아님:", response);
            setCategories([]); // 빈 배열로 초기화
            return;
          }
    
          // 정상적인 경우에만 데이터 설정
          setCategories(response.result.categories);
          setFirstCategories(response.result.categories.map((category: any) => category.name));
        } catch (error) {
          console.error("❌ 카테고리 조회 실패:", error);
          setCategories([]); // 에러 발생 시 빈 배열 설정
        }
      };
    
      loadCategories();
    }, []);
    
  const handleCreate = async () => {
    try {
      const ticketData = {
        title: title || "Default Title",
        content: content || "Default Content",
        categoryId: secondCategories?.childCategories.find((category: any) => category.name === selectedRequestType)?.categoryId,
      };
      console.log("📌 요청 데이터:", ticketData);
  
      const result = await postTicket(ticketData);
      console.log("📌 티켓 생성 결과:", result);
  
      if (!result) {
        console.error("⚠️ 티켓 생성 실패: 응답 데이터 없음");
        alert("티켓 생성에 실패했습니다.");
      }

      console.log("✅ 티켓 생성 성공:", result);
      setIsTicketCreated(true); // 생성 완료 상태로 변경
    } catch (error: any) {
      console.error("❌ 티켓 생성 중 오류 발생:", error);
      console.error("📌 오류 상세 정보:", error.response?.data || error.message);
  
      alert(
        error.response?.data?.message ||
        error.message ||
        "티켓 생성 중 문제가 발생했습니다."
      );
    }
  };

  const updateHelpContent = async (service: string) => {
    if (service === "1차 카테고리를 선택해주세요.") return;
  
    try {
      const response = await fetchGuide(secondCategories?.categoryId);
      console.log("📌 가져온 도움말 데이터:", response);
  
      if (!response || !response.result || !response.result.content) {
        console.warn("⚠️ 도움말 내용이 없습니다.");
        setHelpTitle(`${service}`);
        setHelpContent("해당 카테고리의 도움말이 없습니다.");
      } else {
        setHelpTitle(`${service} 도움말`);
        setHelpContent(response.result.content);
      }
  
      setIsModalOpen(true);
    } catch (error) {
      console.error("❌ 도움말 조회 실패:", error);
      setHelpTitle(`${service} 도움말`);
      setHelpContent("도움말을 불러오는 중 오류가 발생했습니다.");
      setIsModalOpen(true);
    }
  };

  const getTemplate = async (categoryId: string) => {
    try {
      const response = await fetchTemplate(categoryId);
      console.log("📌 가져온 템플릿 데이터:", response);
      
      if (!response.result.content) {
        console.warn("⚠️ 템플릿 내용이 없습니다.");
        setContent("템플릿 내용이 없습니다.");
      } else {
        setContent(response.result.content);
      }
    } catch (error) {
      console.error("❌ 템플릿 조회 실패:", error);
      setContent("템플릿을 불러오는 중 오류가 발생했습니다.");
    }
  }

  const isHelpButtonVisible = selectedService !== "1차 카테고리를 선택해주세요.";
  const isReadyToShow =
    selectedService !== "1차 카테고리를 선택해주세요." &&
    selectedRequestType !== "2차 카테고리를 선택해주세요.";

  if (isTicketCreated) {
    // 티켓 생성 완료 후 표시할 페이지
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ backgroundColor: "#252E66" }}
      >
        <h1 className="text-white text-lg font-semibold">✨티켓 생성이 완료되었습니다!</h1>
      </div>
    );
  }

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
              firstCategories={firstCategories}
            />
          </div>

          <div className="flex flex-col items-start w-80">
            <label>업무</label>
            <SecondTaskDrop
              selectedRequestType={selectedRequestType}
              onRequestTypeChange={handleRequestTypeChange}
              selectedService={selectedService}
              secondCategories={secondCategories?.childCategories}
            />
          </div>
        </div>
      </div>

      {isReadyToShow && (
        <>
          <Template title={title} content={content} setTitle={setTitle} setContent={setContent} />
          <div className="flex justify-center">
            <Button label="작업 승인" onClick={handleCreate} color={1} />
          </div>
        </>
      )}

      {isModalOpen && (
        <Modal onClose={toggleModal}>
          <Help title={helpTitle} content={helpContent}/>
        </Modal>
      )}
    </div>
  );
}
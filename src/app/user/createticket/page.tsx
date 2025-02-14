"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FirstTaskDrop from "@/components/Tickets/firstTaskDrop";
import SecondTaskDrop from "@/components/Tickets/secondTaskDrop";
import Help from "@/components/Modals/Help";
import ModalHelp from "@/components/Modals/ModalHelp";
import Modal from "@/components/Modals/Modal";
import Template from "@/components/Tickets/Template";
import Button from "@/components/Buttons/Button";
import { fetchCategories, fetchGuide, postTicket } from "@/services/user";
import { fetchTemplate } from "@/services/admin";
import AlertModal from "@/components/Modals/AlertModal";

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
  const [countdown, setCountdown] = useState(1);
  const router = useRouter();
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText: '',
    onClose: () => {},
  });

  const showModal = (title: string, btnText = '닫기') => {
    setModalState({
      isOpen: true,
      title,
      btnText,
      onClose: () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
    const selectedCategory = categories.find((category) => category.name === value);
    setSecondCategories(selectedCategory);
    
    // 첫 번째 카테고리가 변경되면 템플릿을 불러옴
    if (selectedCategory) {
      getTemplate(selectedCategory.categoryId);
    }
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
        title: title,
        content: content || "",
        categoryId: secondCategories?.childCategories.find(
          (category: any) => category.name === selectedRequestType
        )?.categoryId,
      };
  
      console.log("📌 요청 데이터:", ticketData);
      const result = await postTicket(ticketData);
      console.log("📌 티켓 생성 결과:", result);
  
      if (!result) {
        console.error("⚠️ 티켓 생성 실패: 응답 데이터 없음");
        showModal("티켓 생성에 실패했습니다.");
        return;
      }
  
      console.log("✅ 티켓 생성 성공:", result);
      setIsTicketCreated(true); // 생성 완료 상태로 변경
      setCountdown(1); // 카운트다운 시작
      showModal("티켓 생성이 완료되었습니다.");
      const timer = setInterval(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
  
      setTimeout(() => {
        clearInterval(timer);
        router.push(`/user/myticket/${result.result.ticketId}`);
      }, 1000);
    } catch (error: any) {
      console.error("❌ 티켓 생성 중 오류 발생:", error);
      console.error("📌 오류 상세 정보:", error.response?.data || error.message);
      showModal(
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
    }
  };

  const isHelpButtonVisible = selectedService !== "1차 카테고리를 선택해주세요.";

  const isReadyToShowTemp =
    selectedService !== "1차 카테고리를 선택해주세요." &&
    selectedRequestType !== "2차 카테고리를 선택해주세요."

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col justify-between">
      <div>
        <h2 className="text-md font-semibold w-60 mb-4">티켓 생성</h2>
        <div className="flex items-start space-x-8 mb-5">
          <div className="flex flex-col items-start w-80">
            <div className="flex items-start space-x-48">
              <label>업무 분류</label>
              {selectedService !== "1차 카테고리를 선택해주세요." && (
                <button
                  className="flex items-center justify-center text-[#6E61CA] hover:text-[#5A50A8] mt-0.5 ml-2"
                  onClick={() => updateHelpContent(selectedService)}
                >
                  <span className="text-sm font-medium mr-1">도움말</span>
                  <img src="/helpIcon.png" alt="Help Icon" className="w-4 h-4" />
                </button>
              )}
            </div>
            <FirstTaskDrop
              selectedService={selectedService}
              onServiceChange={handleServiceChange}
              firstCategories={firstCategories}
            />
          </div>

          {selectedService !== "1차 카테고리를 선택해주세요." && (
            <div className="flex flex-col items-start w-80">
              <label>업무</label>
              <SecondTaskDrop
                selectedRequestType={selectedRequestType}
                onRequestTypeChange={handleRequestTypeChange}
                selectedService={selectedService}
                secondCategories={secondCategories?.childCategories}
              />
            </div>
          )}
        </div>
      </div>

      {isReadyToShowTemp && (
          <Template title={title} content={content} setTitle={setTitle} setContent={setContent} />
          
      )}

      {isReadyToShowTemp && (
            <div className="flex justify-center">
            <Button label="티켓 요청" onClick={handleCreate} color={1} />
          </div>
          )}

      {isModalOpen && (
        <ModalHelp onClose={toggleModal}>
          <Help title={helpTitle} content={helpContent} />
        </ModalHelp>
      )}

      {modalState.isOpen && (
        <Modal onClose={modalState.onClose}>
          <AlertModal
            title={modalState.title}
            onClick={modalState.onClose}
          />
        </Modal>
      )}
    </div>
  );
}
"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Button from "@/components/Buttons/Button";
import { fetchMemberRegisterExcelForm, postMemberRegisterExcelFile } from "@/services/admin";
import AlertModal from "@/components/Modals/AlertModal";
import Modal from "@/components/Modals/Modal";
import axios from "axios";

const AdminMemberEnrollPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    nickname: "",
    department: "",
    phone: "",
    position: "",
    role: "USER",
    profileImageFile: null,
    agitUrl: ""
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    content: "",
    btnText: '',
    onClose: () => { },
  });



  const showModal = (title: string, content = "", btnText = '닫기', onCloseCallback?: () => void) => {
    setModalState({
      isOpen: true,
      title,
      content,
      btnText,
      onClose: () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
        if (onCloseCallback) onCloseCallback();
      },

    });
  };

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formatPhoneNumber = (value: string) => {
    // 숫자만 남기기 (하이픈, 공백 제거)
    const phoneNumber = value.replace(/\D/g, "");

    if (phoneNumber.length <= 3) return phoneNumber;
    if (phoneNumber.length <= 7) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: formatPhoneNumber(value),
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      showModal("로그인이 필요합니다. 다시 로그인해 주세요.");
      setLoading(false);
      return;
    }

    // ✅ FormData 객체 생성 (파일 + JSON 데이터 포함)
    const formDataToSend = new FormData();

    // ✅ 요청 데이터(JSON)를 request 객체로 생성
    const requestData = {
      email: formData.email.trim(),
      name: formData.name.trim(),
      nickname: formData.nickname.trim(),
      department: formData.department.trim(),
      phone: formData.phone.trim(),
      position: formData.position.trim(),
      role: formData.role.trim(),
      agitUrl: formData.agitUrl.trim() || "",
    };

    // ✅ JSON 데이터 추가 (Swagger API의 request 객체 형식 유지)
    formDataToSend.append("request", new Blob([JSON.stringify(requestData)], { type: "application/json" }));

    // ✅ 파일이 있으면 FormData에 추가
    if (formData.profileImageFile) {
      formDataToSend.append("profileImage", formData.profileImageFile);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/members`,
        formDataToSend, // ✅ multipart/form-data 전송
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // ✅ 인증 토큰 추가
            "Content-Type": "multipart/form-data", // ✅ Axios는 자동 처리하지만 명시적으로 추가
          },
        }
      );

      console.log("서버 응답:", response.data); // ✅ 서버 응답 확인

      if (response.status === 201 || response.status === 200) {

        setFormData({
          nickname: "",
          role: "USER", // Swagger API에 맞게 "USER" 유지
          profileImageFile: null, // 파일 리셋
          name: "",
          email: "",
          agitUrl: "",
          department: "",
          phone: "",
          position: "",
        });
        showModal("회원이 성공적으로 등록되었습니다.", "", "확인", () => {
          router.push("/administer/memberlist")
        });
      } else {
        throw response.data
      }
    } catch (error) {
      console.error("❌ 회원 등록 중 오류 발생:", error);

      // ✅ 에러 응답에서 첫 번째 오류 메시지 추출
      if (axios.isAxiosError(error) && error.response?.data?.result) {
        const responseData = error.response?.data;

        if (responseData?.result && typeof responseData.result === "object") {
          // ✅ result가 객체인 경우
          const firstKey = Object.keys(responseData.result)?.[0]; // 첫 번째 key 가져오기
          console.log(firstKey)
          const firstValue = firstKey ? responseData.result[firstKey] : "알 수 없는 오류";
          if (firstKey == 'nickname') {
            showModal(firstValue, `아이디는 3~10자의 영문 소문자로 시작하고, 점(.)과 1~5자의 영문 소문자로 이루어져야 합니다.`, "확인");
          } else if (firstKey == 'phone') {
            showModal(firstValue, `전화번호 형식은 000-0000-0000입니다.`, "확인");
          }
          else {
            const firstValue = firstKey ? responseData.result[firstKey] : "알 수 없는 오류";
            showModal(`${firstValue}`);
          }
        } else {
          // ✅ result가 객체가 아닌 경우
          showModal(responseData?.result);
        }
      } else {
        showModal(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };




  // 양식 다운로드 핸들러
  const handleDownloadTemplate = async () => {
    try {
      const data = await fetchMemberRegisterExcelForm(); // API 호출
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "회원등록양식.xlsx"; // 다운로드할 파일 이름
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("양식 다운로드 중 오류 발생:", error);
      showModal("양식 다운로드 중 오류가 발생했습니다.");
    }
  };

  // 회원 정보 업로드 핸들러
  const handleUploadMembers = async (file: File) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (file.size > MAX_FILE_SIZE) {
      showModal("파일 크기가 5MB를 초과할 수 없습니다.");
      return;
    }

    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      showModal("로그인이 필요합니다. 다시 로그인해 주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await postMemberRegisterExcelFile(formData); // API 호출
      if (response.isSuccess) {
        showModal("회원 정보가 성공적으로 업로드되었습니다.");
      } else {
        showModal(`회원 정보 업로드 실패: ${response.message}`);
      }
    } catch (error) {
      console.error("회원 정보 업로드 중 오류 발생:", error);
      showModal(error.response.data.message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // 미리보기를 위해 파일을 URL로 변환
      const fileURL = URL.createObjectURL(file);

      // 상태 업데이트
      setFormData((prev) => ({
        ...prev,
        profileImage: fileURL, // 미리보기용 URL
        profileImageFile: file, // 실제 파일
      }));
    }
  };

  return (
    <div className="bg-gray-50 flex justify-center p-8">
      <div className="w-full max-w-4xl">

        <div className="w-full max-w-4xl">
          {/* 제목과 버튼을 한 줄에 배치 */}
          <div className="flex justify-between items-center mb-4">
            {/* 제목 (왼쪽 정렬) */}
            <h1 className="text-2xl font-bold text-gray-800">회원 등록</h1>

            <div className="flex space-x-2">
              <Button
                label={<span className="whitespace-nowrap">양식 다운로드</span>}
                onClick={handleDownloadTemplate}
                color={6} // 빈파란색
                className="flex-shrink-0 min-w-max px-4"
              />
              <Button
                label={<span className="whitespace-nowrap">회원 일괄등록</span>}
                onClick={() => {
                  const fileInput = document.createElement('input');
                  fileInput.type = 'file';
                  fileInput.accept = '.xlsx, .xls'; // 엑셀 파일(.xlsx 및 .xls) 모두 허용
                  fileInput.onchange = (e) => {
                    const target = e.target as HTMLInputElement; // 타입 단언
                    const file = target.files?.[0]; // 파일 선택
                    if (file) {
                      handleUploadMembers(file);
                    }
                  };
                  fileInput.click(); // 파일 선택 대화상자 열기
                }}
                color={1} // 초록색
                className="flex-shrink-0 min-w-max px-4"
              />
            </div>

          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-12">
          {/* 상단 프로필 및 기본 정보 */}
          <div className="flex items-center border-b pb-6 mb-6">
            {/* 프로필 이미지 & 사용자 정보 */}
            <div className="flex items-center space-x-8">
              <div className="relative">
                {/* 숨겨진 파일 업로드 input */}
                <input
                  type="file"
                  id="profileImageInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange} // 파일 변경 시 처리
                />

                {/* 프로필 이미지 미리보기 */}
                <img
                  src={formData.profileImageFile || "/defaultProfileImage.jpg"} // 기본 이미지 설정
                  alt="프로필 이미지"
                  className="w-32 h-32 rounded-full object-cover cursor-pointer min-w-32"
                  onClick={() => document.getElementById("profileImageInput")?.click()} // 클릭 시 파일 업로드 창 열기
                />


                <div
                  className="absolute bottom-1 right-1 bg-[#252e66] text-white p-2 rounded-full cursor-pointer shadow-md"
                  onClick={() => document.getElementById("profileImageInput")?.click()}
                >
                  <svg width="18" height="18" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.90316 23.1742H24.0937C26.5312 23.1742 27.7737 21.9552 27.7737 19.5412V7.27167C27.7737 4.85767 26.5312 3.65067 24.0937 3.65067H21.3517C20.4377 3.65067 20.1567 3.46317 19.6292 2.87717L18.6797 1.82217C18.1057 1.17817 17.5082 0.826172 16.2892 0.826172H11.6252C10.4182 0.826172 9.82016 1.17817 9.23466 1.82217L8.28516 2.87717C7.76966 3.45117 7.47666 3.65067 6.56266 3.65067H3.90266C1.46516 3.65067 0.222656 4.85767 0.222656 7.27167V19.5412C0.222656 21.9552 1.46566 23.1742 3.90316 23.1742ZM3.93766 21.2872C2.77766 21.2872 2.10966 20.6662 2.10966 19.4472V7.37717C2.10966 6.15817 2.77766 5.53717 3.93766 5.53717H7.03116C8.08616 5.53717 8.64866 5.33817 9.23466 4.68217L10.1602 3.65067C10.8282 2.90067 11.1682 2.71317 12.2112 2.71317H15.7032C16.7462 2.71317 17.0862 2.90067 17.7542 3.65067L18.6797 4.68167C19.2657 5.33817 19.8282 5.53717 20.8832 5.53717H24.0587C25.2187 5.53717 25.8872 6.15817 25.8872 7.37717V19.4472C25.8872 20.6662 25.2192 21.2872 24.0587 21.2872H3.93766ZM13.9927 19.4242C14.8345 19.4266 15.6686 19.2623 16.4467 18.9409C17.2248 18.6194 17.9316 18.1472 18.5263 17.5513C19.121 16.9555 19.592 16.2478 19.9119 15.4691C20.2319 14.6904 20.3946 13.856 20.3907 13.0142C20.3907 9.45117 17.5547 6.60417 13.9922 6.60417C10.4532 6.60417 7.60566 9.45117 7.60566 13.0142C7.60566 16.5762 10.4532 19.4242 13.9922 19.4242M22.4177 10.1542C23.2147 10.1542 23.8707 9.51017 23.8707 8.71317C23.8707 8.32781 23.7176 7.95824 23.4451 7.68575C23.1726 7.41325 22.803 7.26017 22.4177 7.26017C22.0323 7.26017 21.6627 7.41325 21.3902 7.68575C21.1177 7.95824 20.9647 8.32781 20.9647 8.71317C20.9647 9.51017 21.6207 10.1542 22.4177 10.1542ZM13.9927 17.6432C11.4497 17.6432 9.37566 15.5807 9.37566 13.0142C9.37566 10.4477 11.4382 8.38567 13.9927 8.38567C14.6007 8.38495 15.2029 8.50417 15.7648 8.73651C16.3267 8.96885 16.8373 9.30975 17.2673 9.73968C17.6973 10.1696 18.0382 10.6801 18.2706 11.242C18.503 11.8039 18.6223 12.4061 18.6217 13.0142C18.6224 13.6223 18.5031 14.2245 18.2708 14.7865C18.0384 15.3484 17.6975 15.859 17.2675 16.289C16.8375 16.719 16.3269 17.0599 15.765 17.2923C15.203 17.5247 14.6007 17.6439 13.9927 17.6432Z" fill="white" />
                  </svg>

                </div>

              </div>

              <div className="space-y-4"> {/* 여백 추가 */}
                {/* 닉네임 입력 */}
                <input
                  type="text"
                  name="nickname"
                  placeholder="닉네임을 입력하세요"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 focus:outline-none h-10"
                />

                {/* 역할 선택 */}
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="text-sm font-semibold text-gray-500"
                >
                  <option value="USER">사용자</option>
                  <option value="MANAGER">담당자</option>
                </select>
              </div>
            </div>


            <div className="flex justify-end ml-20 w-full">

            </div>
          </div>




          {/* 회원 등록 폼 */}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* 이름 */}
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-600 mb-2">이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
                placeholder="이름을 입력하세요"
                required
              />
            </div>

            {/* 이메일 주소 */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">이메일 주소</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
                placeholder="이메일 주소를 입력하세요"
                required
              />
            </div>

            {/* 닉네임 */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">아지트 URL</label>
              <input
                type="text"
                name="agitUrl"
                value={formData.agitUrl}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
                placeholder="아지트 URL을 입력하세요"

              />
            </div>

            {/* 부서 */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">부서</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
                placeholder="부서를 입력하세요"
                required
              />
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">전화번호</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleNumberChange}
                className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
                placeholder="010-1234-5678"
                required
              />
            </div>

            {/* 직책 */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">직책</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 px-2 py-2 focus:outline-none"
                placeholder="직책을 입력하세요"
                required
              />
            </div>

            {/* 등록 버튼 */}
            <div className="col-span-2 mt-4">
              <Button
                type="submit"
                onClick={() => { }}
                label="회원 등록"
                className="w-full py-3 rounded-md font-semibold flex-shrink-0 min-w-max text-lg"
                disabled={loading}
                color={1}
              >
                {loading ? "등록 중..." : "회원 등록하기"}
              </Button>
            </div>
          </form>
        </div>
        {modalState.isOpen && (
          <Modal onClose={modalState.onClose}>
            <AlertModal
              title={modalState.title}
              content={modalState.content}
              onClick={modalState.onClose}
              btnText={modalState.btnText}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default AdminMemberEnrollPage;


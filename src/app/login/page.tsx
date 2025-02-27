"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/stores/userStore";
import axios, { AxiosInstance } from "axios";
import AlertModal from "@/components/Modals/AlertModal";
import Modal from "@/components/Modals/Modal";

export default function LoginPage() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    content: "",
    btnText: '',
    onClose: () => { },
  });

  const showModal = (title: string, content: string, btnText = '닫기', onCloseCallback?: () => void) => {
    setModalState({
      isOpen: true,
      title,
      content,
      btnText,
      onClose: () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
        if (onCloseCallback) onCloseCallback(); // ✅ 모달 닫힌 후 실행할 콜백 함수 실행
      },

    });
  };
  // 닉네임 입력 처리
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  // 비밀번호 입력 처리
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const apiConfig = {
    backend: {
      baseURL: process.env.NEXT_PUBLIC_BASE_URL
    },
  };

  const server = apiConfig.backend.baseURL;

  const api: AxiosInstance = axios.create({
    baseURL: server,
    withCredentials: true, // 쿠키를 포함한 인증 정보를 서버에 전송
    headers: {
      "Content-Type": "application/json",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nickname === "" || password === "") {
      showModal("닉네임과 비밀번호를 입력하세요.");
      return;
    }

    try {
      // Axios를 사용하여 로그인 API 호출
      const response = await api.post("/api/auth/login", { nickname, password });


      // ✅ 토큰 저장
      if (response.data.result?.accessToken && response.data.result?.refreshToken) {
        sessionStorage.setItem("accessToken", response.data.result.accessToken);
        sessionStorage.setItem("refreshToken", response.data.result.refreshToken);
        console.log("토큰이 세션스토리지에 저장되었습니다.");
      } else {
        console.error("토큰이 응답에 포함되어 있지 않습니다.");
      }

      // ✅ Zustand userStore에 로그인 정보 저장
      if (response.data.result) {
        setUser({
          profileImage: response.data.result.profileImage,
          name: response.data.result.name,
          role: response.data.result.role,
          nickname: response.data.result.nickname,
        });
        console.log("사용자 정보가 userStore에 저장되었습니다.");
      }

      // 임시 비밀번호인 경우 변경 페이지로 이동
      if (response.data.result.isTempPassword) {
        showModal("임시 비밀번호입니다.\n 비밀번호 변경이 필요합니다.", "","확인", () => {
          router.push("/changepassword")
        })

      } else {
        // 로그인 성공 시 리다이렉트
        showModal("로그인 성공!", "", "확인", () => {
          switch (response.data.result.role) {
            case "USER":
              router.push("/user/home");
              break;
            case "MANAGER":
              router.push("/manager/home");
              break;
            case "ADMIN":
              router.push("/administer/memberlist");
              break;
          }
        })


      }
    } catch (err: any) {
      console.error("로그인 에러:", err);

      // ✅ 서버 응답 메시지가 있으면 alert 표시
      if (err.response.data.code == "AUTH_302"){
        showModal("비밀번호를 5회 연속 잘못 입력하였습니다.", "30분 동안 계정이 잠깁니다.", "확인");
      } else if (err.response?.data?.message) {
        showModal(err.response.data.message);
      } else {
        showModal("서버와 통신 중 오류가 발생했습니다.");
      }

      setError("서버와 통신 중 오류가 발생했습니다.");
    }
  };


  // 비밀번호 재발급 페이지로 이동
  const handleForgotPassword = () => {
    router.push("/reissuepassword");
  };

  return (

    <div className="overflow-hidden h-screen">
      <header className="w-full bg-white py-4 shadow-sm">
        <div className="w-full flex items-center justify-between px-6">
          {/* 로고 */}
          <svg width="96" height="32" viewBox="0 0 96 32" fill="none">
            <path
              d="M88.6667 10.4575V20.8761C88.6667 23.1707 88.085 24.8761 86.9218 25.9924C85.7585 27.1087 84.0678 27.6668 81.8498 27.6668C80.671 27.6668 79.5543 27.5195 78.4995 27.225C77.4603 26.9304 76.584 26.504 75.8705 25.9459L77.313 23.3412C77.8403 23.7754 78.484 24.1164 79.244 24.3645C80.0041 24.6126 80.7718 24.7366 81.5474 24.7366C82.7572 24.7366 83.6413 24.4575 84.1997 23.8994C84.758 23.3412 85.0372 22.4885 85.0372 21.3412V20.9226C84.5719 21.3878 84.0213 21.7443 83.3854 21.9924C82.7494 22.2405 82.067 22.3645 81.338 22.3645C79.6939 22.3645 78.391 21.8994 77.4293 20.9691C76.4677 20.0234 75.9868 18.6126 75.9868 16.7366V10.4575H79.6163V16.2017C79.6163 18.2327 80.4616 19.2482 82.1523 19.2482C83.0209 19.2482 83.7188 18.9691 84.2462 18.411C84.7735 17.8374 85.0372 16.9924 85.0372 15.8761V10.4575H88.6667Z"
              fill="#252E66" />
            <path
              d="M74.0067 22.3646C73.6499 22.6282 73.2079 22.8297 72.6805 22.9693C72.1687 23.0933 71.6336 23.1553 71.0752 23.1553C69.5707 23.1553 68.4151 22.7755 67.6086 22.0158C66.802 21.2561 66.3988 20.1398 66.3988 18.6669V7.69019H70.0282V10.7367H73.1226V13.5274H70.0282V18.6204C70.0282 19.1475 70.1601 19.5584 70.4238 19.853C70.6874 20.132 71.0674 20.2716 71.5638 20.2716C72.1222 20.2716 72.6185 20.1165 73.0528 19.8065L74.0067 22.3646Z"
              fill="#252E66" />
            <path
              d="M58.0962 20.248C58.7476 20.248 59.3215 20.155 59.8179 19.9689C60.3297 19.7674 60.8028 19.4573 61.2371 19.0387L63.1681 21.1317C61.9893 22.4805 60.2677 23.155 58.0031 23.155C56.5917 23.155 55.3431 22.8836 54.2573 22.341C53.1716 21.7829 52.334 21.0154 51.7446 20.0387C51.1552 19.0619 50.8605 17.9534 50.8605 16.7131C50.8605 15.4883 51.1475 14.3875 51.7214 13.4108C52.3108 12.4185 53.1096 11.6511 54.1177 11.1084C55.1414 10.5503 56.2892 10.2712 57.5611 10.2712C58.7554 10.2712 59.8411 10.5271 60.8183 11.0387C61.7954 11.5348 62.571 12.2635 63.1449 13.2247C63.7343 14.1705 64.029 15.2945 64.029 16.5968L54.7692 18.3875C55.0329 19.0077 55.4439 19.4728 56.0023 19.7829C56.5762 20.0929 57.2741 20.248 58.0962 20.248ZM57.5611 13.0154C56.646 13.0154 55.9014 13.31 55.3276 13.8991C54.7537 14.4883 54.4512 15.3022 54.4202 16.341L60.5158 15.155C60.3452 14.5038 59.9962 13.9844 59.4689 13.5968C58.9415 13.2092 58.3056 13.0154 57.5611 13.0154Z"
              fill="#252E66" />
            <path
              d="M42.3518 18.0622L40.6069 19.7831V22.9692H36.9774V5.71338H40.6069V15.4808L45.9115 10.4576H50.2389L45.0274 15.7599L50.7042 22.9692H46.307L42.3518 18.0622Z"
              fill="#252E66" />
            <path
              d="M29.3715 23.155C28.0376 23.155 26.8355 22.8836 25.7653 22.341C24.7106 21.7829 23.8808 21.0154 23.2759 20.0387C22.6865 19.0619 22.3918 17.9534 22.3918 16.7131C22.3918 15.4728 22.6865 14.3643 23.2759 13.3875C23.8808 12.4108 24.7106 11.6511 25.7653 11.1084C26.8355 10.5503 28.0376 10.2712 29.3715 10.2712C30.6899 10.2712 31.8377 10.5503 32.8148 11.1084C33.8075 11.6511 34.5287 12.434 34.9785 13.4573L32.1634 14.9689C31.5119 13.8216 30.5736 13.248 29.3482 13.248C28.4021 13.248 27.6188 13.5581 26.9984 14.1782C26.378 14.7984 26.0678 15.6433 26.0678 16.7131C26.0678 17.7829 26.378 18.6278 26.9984 19.248C27.6188 19.8681 28.4021 20.1782 29.3482 20.1782C30.5891 20.1782 31.5275 19.6046 32.1634 18.4573L34.9785 19.9922C34.5287 20.9844 33.8075 21.7596 32.8148 22.3178C31.8377 22.8759 30.6899 23.155 29.3715 23.155Z"
              fill="#252E66" />
            <path d="M16.3245 10.4575H19.9539V22.9691H16.3245V10.4575Z" fill="#252E66" />
            <path
              d="M18.1392 8.71326C17.4723 8.71326 16.9294 8.51946 16.5106 8.13187C16.0919 7.74427 15.8825 7.26365 15.8825 6.69C15.8825 6.11636 16.0919 5.63574 16.5106 5.24814C16.9294 4.86055 17.4723 4.66675 18.1392 4.66675C18.8062 4.66675 19.3491 4.85279 19.7678 5.22489C20.1866 5.59698 20.396 6.0621 20.396 6.62024C20.396 7.22489 20.1866 7.72876 19.7678 8.13187C19.3491 8.51946 18.8062 8.71326 18.1392 8.71326Z"
              fill="#F4C62E" />
            <path
              d="M14.2746 22.3646C13.9178 22.6282 13.4758 22.8297 12.9484 22.9693C12.4366 23.0933 11.9015 23.1553 11.3431 23.1553C9.83856 23.1553 8.68303 22.7755 7.87648 22.0158C7.06994 21.2561 6.66666 20.1398 6.66666 18.6669V7.69019H10.2961V10.7367H13.3905V13.5274H10.2961V18.6204C10.2961 19.1475 10.428 19.5584 10.6916 19.853C10.9553 20.132 11.3353 20.2716 11.8317 20.2716C12.39 20.2716 12.8864 20.1165 13.3207 19.8065L14.2746 22.3646Z"
              fill="#252E66" />
          </svg>
        </div>
      </header>


      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-main-2">
        {/* 로그인 박스 */}
        <div className="bg-white rounded-lg shadow-md px-20 pb-14 pt-20">
          <h2 className="text-3xl font-bold mb-2">로그인</h2>
          <p className="text-sm text-gray-600 mb-6">
            서비스를 사용하려면 로그인하세요.
          </p>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={handleNicknameChange}
                className="w-[440px] px-3 py-4 border rounded-md focus:ring-2 focus:ring-[#252E66] focus:outline-none"
                placeholder="아이디를 입력하세요"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-[440px] px-3 py-4 border rounded-md focus:ring-2 focus:ring-[#252E66] focus:outline-none"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className={`w-full py-3 rounded-md font-semibold transition-all
    ${nickname && password ? "bg-[#252E66] text-white hover:bg-[#1F2557]" : "bg-gray-400 text-white cursor-not-allowed"}
  `}
              disabled={!nickname || !password} // 닉네임과 비밀번호가 없으면 비활성화
            >
              로그인
            </button>


            {/* 비밀번호 찾기 버튼 */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-[#252E66] hover:underline focus:outline-none"
              >
                비밀번호를 잊으셨나요?
              </button>
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
}

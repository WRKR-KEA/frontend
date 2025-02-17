'use client';

import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useMemberListQuery } from '@/hooks/useMemberList';
import PagePagination from '@/components/pagination';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ✅ useRouter 추가
import AlertModal from "@/components/Modals/AlertModal";
import Modal from "@/components/Modals/Modal";
import Skeleton from '@/components/Skeleton';
import { HighlightText } from '@/components/highlightText';


export default function AdminMemberListPage() {
  const [activeTab, setActiveTab] = useState('전체'); // 역할 선택 (탭)
  const [currentPage, setCurrentPage] = useState(1); // 페이지네이션
  const [searchInput, setSearchInput] = useState(""); // 검색 입력 필드
  const [searchTrigger, setSearchTrigger] = useState(""); // ✅ Enter 입력 후 실행할 검색어
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    btnText: '',
    onClose: () => { },
  });
  const router = useRouter(); // ✅ useRouter 사용

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

  // ✅ 역할 선택 시 role 변경 (탭 클릭)
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    setCurrentPage(1); // 역할 변경 시 첫 페이지로 이동
  };

  // ✅ 페이지네이션 변경 (추가됨)
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // ✅ 검색 입력 필드 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // ✅ 검색 입력 후 Enter 키 입력 시 실행
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchTrigger(searchInput); // ✅ 현재 검색어로 실행
      setCurrentPage(1); // 검색 시 첫 페이지로 이동
    }
  };

  const handleSearch = () => {

    setSearchTrigger(searchInput); // ✅ 현재 검색어로 실행
    setCurrentPage(1); // 검색 시 첫 페이지로 이동

  };

  // ✅ 역할(role) 매핑 함수
  const getRoleQuery = () => {
    if (activeTab === '사용자') return 'USER';
    if (activeTab === '담당자') return 'MANAGER';
    return undefined; // 전체일 경우 role을 아예 제거 (쿼리에 포함되지 않도록)
  };

  // ✅ useMemberListQuery 훅 사용 (동적 파라미터 적용)
  const { data: members, isLoading, error, refetch } = useMemberListQuery({
    page: currentPage,
    size: 10, // 항상 10으로 고정
    role: getRoleQuery(), // 역할 매핑
    query: searchTrigger, // ✅ Enter 입력 시 검색어 적용
  });

  // ✅ API 응답의 현재 페이지 값으로 currentPage 업데이트
  useEffect(() => {
    if (members?.data?.result?.currentPage) {
      setCurrentPage(members?.data?.result?.currentPage);
    }
  }, [members?.data?.result?.currentPage]);

  // ✅ 선택된 유저 ID 리스트
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // ✅ 체크박스 변경 핸들러
  const handleCheckboxChange = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId],
    );
  };

  // ✅ 선택한 유저 삭제 API 호출
  const handleDeleteMembers = async () => {
    if (selectedMembers.length === 0) {
      showModal("삭제할 회원을 선택해주세요.");
      return;
    }

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        showModal("로그인이 필요합니다.");
        router.push('/login'); // ✅ 로그인 페이지로 이동 😎push 대신 replace 사용
        return;
      }

      const isConfirmed = confirm("정말로 삭제하시겠습니까?");
      if (!isConfirmed) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/members`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ memberIdList: selectedMembers }),
      });

      if (!response.ok) {
        throw new Error('회원 삭제 실패');
      }

      showModal("선택한 회원이 삭제되었습니다.");
      setSelectedMembers([]);
      refetch();
    } catch (error) {
      console.error('❌ 삭제 요청 실패:', error);
      showModal("회원 삭제 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return <Skeleton width={"100%"} height={"100%"} />
  }

  if (error) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <div className="flex flex-col bg-white p-4 rounded-md w-full">
      <div className="flex items-center">
        <h2 className="text-md font-semibold">회원 조회</h2>
        <div className="flex items-center space-x-2 ml-4">
          <div className="flex items-center border-b p-2">

            <input
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={handleSearch} // ✅ Enter 키 입력 감지
              placeholder="아이디, 이름, 이메일, 부서 검색"
              className="outline-none text-sm w-[180px]"
            />
            <FaSearch className="text-gray-500 mr-2 cursor-pointer" />
          </div>
        </div>
      </div>




      <div className="flex flex-col w-full mt-2">
        <div className="flex items-center border-b">
          {['전체', '사용자', '담당자'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`w-32 text-center py-3 font-semibold ${activeTab === tab ? "border-b-2 border-black text-black" : "text-gray-500"
                }`}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={handleDeleteMembers}
            className={`ml-auto px-4 py-2 text-white rounded-md transition-all duration-200 shadow-sm 
    ${selectedMembers.length > 0 ?
                "bg-red-500 hover:bg-red-600 hover:shadow-md focus:ring-2 focus:ring-red-300"
                : "bg-red-300 cursor-not-allowed opacity-50"}`}
            disabled={selectedMembers.length === 0}
          >
            회원 삭제
          </button>

        </div>

        <div className="mt-3">
          <table className="w-full table-fixed border-collapse rounded-md">
            <thead>
              <tr>
                <th className="p-3 w-1/12"></th>
                <th className="p-3 text-left w-3/12">아이디</th>
                <th className="p-3 text-left w-2/12">이름</th>
                <th className="p-3 text-left w-2/12">부서</th>
                <th className="p-3 text-left w-2/12">직책</th>
                <th className="p-3 text-left w-3/12">전화번호</th>
                <th className="p-3 text-left w-4/12">이메일 주소</th>
              </tr>
            </thead>
            <tbody>
              {members?.elements?.map((row: any, index: number) => (
                <tr key={index} className={index % 2 === 0 ? "bg-[#F5F5F5]" : ""}>
                  <td className="p-3 w-1/12">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(row.memberId)}
                      onChange={() => handleCheckboxChange(row.memberId)}
                      className="w-5 h-5 ml-2 accent-[#4B5FC2] cursor-pointer rounded-md border-2 border-gray-400 transition-all duration-200 checked:bg-[#4B5FC2] checked:border-transparent focus:ring-2 focus:ring-[#4B5FC2] focus:outline-none"
                    />
                  </td>

                  <td className="p-4 w-3/12">
                    <Link href={`memberlist/${row.memberId}`} className="cursor-pointer hover:underline">
                      <div className="flex items-center space-x-3">
                        <img
                          src={row.profileImage || "userProfileImage.png"}
                          alt={row.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span>
                          <HighlightText text={row.nickname} highlight={searchInput} />
                        </span>
                      </div>
                    </Link>
                  </td>
                  <td className="p-3 w-2/12">
                    <HighlightText text={row.name} highlight={searchInput} />
                  </td>
                  <td className="p-4 w-2/12">
                    <HighlightText text={row.department} highlight={searchInput} />
                  </td>
                  <td className="p-4 w-2/12">{row.position}</td>
                  <td className="p-4 w-3/12">{row.phone}</td>
                  <td className="p-4 w-4/12">
                    <HighlightText text={row.email} highlight={searchInput} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {
          members?.elements.length > 0 ? (
            <>
              <div className="flex justify-center mt-4">
                <PagePagination
                  totalPages={members?.totalPages || 10}
                  itemsCountPerPage={members?.size || 10}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageChange}
                  currentPage={members?.currentPage}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <p className="text-lg">검색 결과가 없습니다.</p>
            </div>
          )
        }

      </div>
      {modalState.isOpen && (
        <Modal onClose={modalState.onClose}>
          <AlertModal
            title={modalState.title}
            onClick={modalState.onClose}
            btnText={modalState.btnText}
          />
        </Modal>
      )}
    </div>
  );
}
import api from "@/lib/api/axios";

// (DELETE) 카테고리 삭제
export async function deleteAdminCategories(categoryId: string) {
  try {
    const { data } = await api.delete(`/api/admin/categories/${categoryId}`);
    return data;
  } catch (error) {
    console.error("카테고리 삭제에 실패했습니다. :", error);
  }
}

// (GET) 카테고리 전체 조회
export async function fetchAminCategories() {
  try {
    const { data } = await api.get("/api/admin/categories");
    return data;
  } catch (error) {
    console.error("카테고리 전체 조회에 실패했습니다. :", error);
  }
}

// (PATCH) 카테고리 순서 수정
export async function updateAdminCategoryOrder(categoryData: {
  categoryId: string;
  seq: number;
}) {
  try {
    const { data } = await api.patch("/api/admin/categories", categoryData);
    return data;
  } catch (error) {
    console.error("카테고리 순서 수정에 실패했습니다. :", error);
  }
}

// (PATCH) 카테고리 이름 수정
export async function updateAdminCategoryName(
  categoryId: string,
  categoryData: { name: string }
) {
  try {
    const { data } = await api.patch(
      `/api/admin/categories/${categoryId}`,
      categoryData
    );
    return data;
  } catch (error) {
    console.error("카테고리 이름 수정에 실패했습니다. :", error);
  }
}

// (POST) 카테고리 추가
export async function postAdminCategory(categoryData: {
  categoryId: string;
  seq: number;
}) {
  try {
    const { data } = await api.post("/api/admin/categories", categoryData);
    return data;
  } catch (error) {
    console.error("카테고리 추가에 실패했습니다. :", error);
  }
}

// (DELETE) 관리자 - 선택한 회원 삭제
export async function deleteAdminMembers(membersData: {
  memberIdList: string[];
}) {
  try {
    const { data } = await api.delete("/api/admin/members");
    return data;
  } catch (error) {
    console.error("회원 삭제에 실패했습니다. :", error);
  }
}

// (GET) 관리자 - 회원 정보 목록 조회 및 검색(페이징)
export async function fetchAdminMemberList(
  page: number,
  size: number,
  role?: string,
  email?: string,
  name?: string,
  department?: string
) {
  try {
    const { data } = await api.get(
      `/api/admin/members?page=${page}&size=${size}&role=${role}&email=${email}&name=${name}&department=${department}`
    );
    return data;
  } catch (error) {
    console.error(
      "관리자 - 회원 정보 목록 조회 및 검색에 실패했습니다. :",
      error
    );
  }
}

// (GET) 회원 상세 조회
export async function fetchAdminMembers(memberId: string) {
  try {
    const { data } = await api.get(`/api/admin/members/${memberId}`);
    return data;
  } catch (error) {
    console.error("회원 상세 조회에 실패했습니다. :", error);
  }
}

// (PATCH) 회원 정보 수정
export async function updateAdminMember(
  memberId: string,
  memberData: {
    email: string;
    name: string;
    nickname: string;
    department: string;
    position: string;
    phone: string;
    role: string;
    profileImage: string;
  }
) {
  try {
    const { data } = await api.patch(
      `/api/admin/members/${memberId}`,
      memberData
    );
    return data;
  } catch (error) {
    console.error("회원 정보 수정에 실패했습니다. :", error);
  }
}

// (POST) 관리자 - 회원 등록
export async function postAdminMember(memberData: {
  email: string;
  name: string;
  nickname: string;
  department: string;
  position: string;
  phone: string;
  role: string;
  profileImage: string;
}) {
  try {
    const { data } = await api.post("/api/admin/members", memberData);
    return data;
  } catch (error) {
    console.error("회원 등록에 실패했습니다. :", error);
  }
}

// (DELETE) 도움말 삭제
export async function deleteAdminGuide(cryptoGuideId: string) {
  try {
    const { data } = await api.delete(`/api/admin/guide/${cryptoGuideId}`);
    return data;
  } catch (error) {
    console.error("도움말 삭제에 실패했습니다. :", error);
  }
}

// (PATCH) 도움말 수정
export async function patchAdminGuide(
  cryptoGuideId: string,
  guideData: { content: string }
) {
  try {
    const { data } = await api.patch(
      `/api/admin/guide/${cryptoGuideId}`,
      guideData
    );
    return data;
  } catch (error) {
    console.error("도움말 수정에 실패했습니다. :", error);
  }
}

// (POST) 도움말 생성
export async function postAdminGuide(
  cryptoGuideId: string,
  guideData: { content: string }
) {
  try {
    const { data } = await api.post(
      `/api/admin/guide/${cryptoGuideId}`,
      guideData
    );
    return data;
  } catch (error) {
    console.error("도움말 생성에 실패했습니다. :", error);
  }
}

// (DELETE) 관리자 템플릿 삭제
export async function deleteAdminTemplate(templateId: string) {
  try {
    const { data } = await api.delete(`/api/admin/templates/${templateId}`);
    return data;
  } catch (error) {
    console.error("관리자 템플릿 삭제에 실패했습니다. :", error);
  }
}

// (PATCH) 관리자 템플릿 수정
export async function patchAdminTemplate(
  categoryId: string,
  templateData: { content: string }
) {
  try {
    const { data } = await api.patch(
      `/api/admin/templates/${categoryId}`,
      templateData
    );
    return data;
  } catch (error) {
    console.error("관리자 템플릿 수정에 실패했습니다. :", error);
  }
}

// (POST) 관리자 템플릿 추가
export async function postAdminTemplate(templateData: {
  categoryId: string;
  content: string;
}) {
  try {
    const { data } = await api.post("/api/admin/templates", templateData);
    return data;
  } catch (error) {
    console.error("관리자 템플릿 추가에 실패했습니다. :", error);
  }
}

// (GET) 회원 등록 엑셀 파일 양식 다운로드
export async function fetchMemberRegisterExcelForm() {
  try {
    const response = await api.get("/api/admin/members/excel/example", {
      responseType: 'blob', // 응답을 Blob 형식으로 요청
    });
    console.log(response);
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error("회원 등록 엑셀 파일 양식 다운로드에 실패했습니다:", error);
    throw error; // 오류를 다시 던져서 호출한 곳에서 처리할 수 있도록
  }
}

// (POST) 회원 정보 담긴 엑셀 파일 업로드
export async function postMemberRegisterExcelFile(file: FormData) {
  try {
    const response = await api.post("/api/admin/members/excel", file, {
      headers: {
        'Content-Type': 'multipart/form-data', // 파일 업로드를 위한 헤더 설정
      },
    });
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error("엑셀 파일 업로드를 통한 회원 등록에 실패했습니다:", error);
    throw error; // 오류를 다시 던져서 호출한 곳에서 처리할 수 있도록
  }
}




// (GET) 사용자, 관리자 템플릿 조회
export async function fetchTemplate(categoryId: string) {
  try {
    const { data } = await api.get(`/api/user/templates/${categoryId}`);
    return data;
  } catch (error) {
    console.error("❌ 템플릿 조회에 실패했습니다. :", error);
  }
}

// (GET) 회원 접속 로그 조회
export async function fetchAdminAccessLogs(
  page: number,
  size: number,
  query?: string,
  startDate?: string,
  endDate?: string,
) {
  try {
    const { data } = await api.get(`/api/admin/access-logs`, {
      params: { page, size, query, startDate, endDate },
    });

    return data;
  } catch (error) {
    console.error("❌ 회원 접속 로그 조회에 실패했습니다. :", error);
    return null;
  }
}

// (GET) 회원 접속 로그 엑셀 파일 다운로드
export async function fetchAdminAccessLogsExcel(
  query?: string,
  startDate?: string,
  endDate?: string,
) {
  try {
    const { data } = await api.get(`/api/admin/access-logs/excel?query=${query}&startDate=${startDate}&endDate=${endDate}`, {
      responseType: 'blob',
    }
  );

    return data;
  } catch (error) {
    console.error("❌ 회원 접속 로그 조회 엑셀 다운로드에 실패했습니다. :", error);
    return null;
  }
}



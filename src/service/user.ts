import api from "../lib/api/axios";

// (GET) 코멘트 내역 조회
export async function fetchComments(ticketId: string) {
  try {
    const { data } = await api.get(`/api/user/tickets/${ticketId}/comments`);
    return data;
  } catch (error) {
    console.error("코멘트 내역 조회에 실패했습니다. :", error);
  }
}

// (POST) 코멘트 작성
export async function postComment(
  ticketId: string,
  postData: { content: string }
) {
  try {
    const { data } = await api.post(
      `/api/user/tickets/${ticketId}/comments`,
      postData
    );
    return data;
  } catch (error) {
    console.error("코멘트 작성에 실패했습니다. :", error);
  }
}

// (GET) 도움말 조회
export async function fetchGuide(cryptoCategoryId: string) {
  try {
    const { data } = await api.get(`/api/user/guide/${cryptoCategoryId}`);
    return data;
  } catch (error) {
    console.error('도움말 조회에 실패했습니다. "', error);
  }
}

// (GET) 사용자 마이페이지 조회API
export async function fetchMyPage() {
  try {
    const { data } = await api.get(`/api/user/my-page`);
    return data;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message ||
        "마이페이지 정보를 불러오는데 실패했습니다."
    );
  }
}

// (PATCH) 사용자 마이페이지 정보 수정 API
export async function updateMyPage(
  updateData: { position?: string; phone?: string }
) {
  try {
    const { data } = await api.patch(
      `/api/user/my-page`,
      updateData
    );
    return data;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "마이페이지 정보 수정에 실패했습니다."
    );
  }
}

// (GET) 사용자, 관리자 템플릿 조회
export async function fetchTemplates(categoryId: string) {
  try {
    const { data } = await api.get(`/api/user/templates/${categoryId}`);
    return data;
  } catch (error: any) {
    console.error("사용자, 관리자 템플릿 조회에 실패했습니다. :", error);
  }
}

// (GET) 카테고리 전체 조회
export async function fetchCategories() {
  try {
    const { data } = await api.get("/api/user/categories");
    return data;
  } catch (error: any) {
    console.error("카테고리 전체 조회에 실패했습니다. :", error);
  }
}

// (GET) 사용자 요청 전체 티켓 조회
export async function fetchTicketList(
  page?: number,
  size?: number,
  sort?: string
) {
  try {
    const { data } = await api.get(
      `/api/user/tickets?page=${page}&size=${size}&sort=${sort}`
    );
    return data;
  } catch (error: any) {
    console.error("사용자 요청 전체 티켓 조회에 실패했습니다. :", error);
  }
}

// (GET) 사용자 요청한 특정 티켓 조회
export async function fetchTicketDetail(ticketId: string) {
  try {
    const { data } = await api.get(`/api/user/tickets/${ticketId}`);
    return data;
  } catch (error: any) {
    console.error("사용자 요청한 특정 티켓 조회에 실패했는다. :", error);
  }
}

// (PATCH) 사용자 요청 티켓 취소
export async function updateTicket(ticketId: string) {
  try {
    const { data } = await api.patch(`/api/user/tickets/${ticketId}`);
    return data;
  } catch (error: any) {
    console.error("사용자 요청 티켓 취소에 실패했습니다. :", error);
  }
}

// (POST) 사용자 티켓 요청
export async function postTicket(ticketData: {
  title: string;
  content: string;
  categoryId: string;
}) {
  try {
    const { data } = await api.post("/api/user/tickets", ticketData);
    return data;
  } catch (error: any) {
    console.error("사용자 티켓 요청에 실패했습니다. :", error);
  }
}

// (POST) 로그인은 세부 내용을 몰라서 제가 건들지 못할거같네요 'ㅅ'

// (PATCH) 비밀번호 재설정
export async function updatePassword(passwordData: { password: string }) {
  try {
    const { data } = await api.patch(
      "/api/user/members/password",
      passwordData
    );
    return data;
  } catch (error: any) {
    console.error("비밀번호 재설정에 실패했습니다. :", error);
  }
}

// (POST) 비밀번호 재발급, API 명세서에 바디에 무엇을 넣어야 할 지 안나와있네여 'ㅅ'

// (POST) 토큰 재발급, 이거도 ㅇㅅㅇ

// (DELETE) 로그아웃 이거도 ;ㅅ;

/**
 * (GET)
 * const [userInfo, setUserInfo] = useState(null);
 *
 * const data = await fetchMyPage(memberId);
 * setUserInfo(data);
 * setPosition(data.position);
 * setPhone(data.phone);
 *
 * (POST, PUT, DELETE, PATCH)
 * const [newComment, setNewComment] = useState('');
 * postComment(ticketId, { content: newComment });
 */

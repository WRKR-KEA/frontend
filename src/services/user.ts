import api from "@/lib/api/axios";

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
  content: string,
  attachments: File[] = [],
) {
  try {
    const formData = new FormData();
    const accessToken = sessionStorage.getItem("accessToken");

    // CommentRequest 객체 추가
    formData.append('CommentRequest', JSON.stringify({ content }));

    // attachments가 있을 때만 첨부파일 추가
    attachments.forEach((file) => {
      formData.append('attachments', file);
    });

    const { data } = await api.post(
      `/api/user/tickets/${ticketId}/comments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`,
        },
      },
    );
    return data;
  } catch (error) {
    console.error('코멘트 작성에 실패했습니다. :', error);
  }
}

// (POST) 리마인더 전송
export async function postRemind(ticketId:string, remindData:{memberId:string}){
  try{
    const accessToken = sessionStorage.getItem("accessToken");
    const { data } = await api.post(
      `/api/user/tickets/${ticketId}/remind`,
      remindData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      },
    );
    return data;
  }catch (error){
    throw error;
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
export async function fetchMyPage(memberId: string) {
  try {
    const { data } = await api.get(`/api/user/my-page/${memberId}`);
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
  memberId: string,
  updateData: { position?: string; phone?: string }
) {
  try {
    const { data } = await api.patch(
      `/api/user/my-page/${memberId}`,
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
  const accessToken = sessionStorage.getItem("accessToken");
  try {
    const { data } = await api.get(`/api/user/categories`, {
      headers: {
        Accept: "application/json;charset=UTF-8",
        Authorization: `Bearer ${accessToken}`,
      },
    });
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
    console.error("사용자 요청한 특정 티켓 조회에 실패했습니다. :", error);
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
    return { result: data, error: null };
  } catch (error: any) {
    console.error("사용자 티켓 요청에 실패했습니다. :", error);
    return { result: null, error: error }; // 오류가 발생하면 error를 반환
  }
}

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

// (GET) 읽지 않은 알림 개수 조회
export async function fetchNotificationCount() {
  try {
    const { data } = await api.get(`/api/user/notifications/count`);
    return data;
  } catch (error: any) {
    console.error("알림 개수 조회에 실패했습니다. :", error);
  }
}

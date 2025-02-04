import axios from 'axios';

const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInR5cGUiOiJBQ0NFU1MiLCJzdWIiOiJ1c2VyLmN5dyIsImV4cCI6MTc0MDMxMDg0N30.YdTnsOwMVORmdhwmw6pM5IC1CWK-2BVRvyPEgfjQdOI";

export interface TicketData {
  title: string;
  content: string;
  categoryId: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// 티켓 생성 API
export async function createTicket(userId: number, ticketData: TicketData) {
  const url = `${BASE_URL}/api/user/tickets`;

  try {
    const response = await axios.post(url, ticketData, {
        params: { userId },
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${accessToken}`, // 'authorization' -> 'Authorization'
        },
        withCredentials: true,
      });
    console.log("Response Data:", response.data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "티켓 생성에 실패했습니다.");
  }
}

// 카테고리 조회 API /api/user/cateogories

// 도움말 조회 API

// 템플릿 조회 API
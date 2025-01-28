import axios from 'axios';

export interface TicketData {
  title: string;
  content: string;
  categoryId: string;
}

const BASE_URL = "http://localhost:8080";

export async function createTicket(userId: number, ticketData: TicketData) {
  const url = `${BASE_URL}/api/user/tickets`;

  try {
    const response = await axios.post(url, ticketData, {
      params: { userId }, // 쿼리 매개변수 설정
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });
    console.log("Response Data:", response.data);
    return response.data; // 응답 데이터 반환
  } catch (error: any) {
    console.error("Error Response:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "티켓 생성에 실패했습니다.");
  }
}
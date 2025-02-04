import axios from 'axios';

export interface Ticket {
  id: string;
  managerName: string;
  serialNumber: string;
  title: string;
  status: string;
  createdAt: string;
  startedAt: string;
  updatedAt: string;
}

export interface TicketResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    tickets: Ticket[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    size: number;
  };
}

export interface TicketDetail {
  id: string;
  title: string;
  content: string;
  status: string;
  userName: string;
  managerName: string;
  createdAt: string;
  updatedAt: string;
  startedAt: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// 사용자 요청 전체 티켓 조회 API
export async function getUserTickets(userId: number, page: number, size: number): Promise<TicketResponse> {
  const url = `${BASE_URL}/api/user/tickets`;

  try {
    const response = await axios.get<TicketResponse>(url, {
      params: { userId, page, size },
      headers: {
        'Accept': 'application/json;charset=UTF-8',
      },
    });
    console.log("Fetched Tickets:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error Fetching Tickets:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "티켓 조회에 실패했습니다.");
  }
}

// 사용자 요청 상세 티켓 조회 API
export async function getTicketById(userId: number, ticketId: string): Promise<TicketDetail> {
  const url = `${BASE_URL}/api/user/tickets/${ticketId}`;

  try {
    const response = await axios.get<TicketDetail>(url, {
      params: { userId },
      headers: {
        'Accept': 'application/json;charset=UTF-8',
      },
    });
    console.log("Fetched Ticket Detail:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error Fetching Ticket Detail:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "티켓 상세 조회에 실패했습니다.");
  }
}

// 사용자 요청 티켓 취소 API
export async function cancelTicket(userId: number, ticketId: string): Promise<{ id: string }> {
  const url = `${BASE_URL}/api/user/tickets/${ticketId}`;

  try {
    const response = await axios.patch(url, null, {
      params: { userId },
      headers: {
        'Accept': 'application/json;charset=UTF-8',
      },
    });
    console.log("Cancelled Ticket:", response.data);
    return response.data.result;
  } catch (error: any) {
    console.error("Error Cancelling Ticket:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "티켓 취소에 실패했습니다.");
  }
}
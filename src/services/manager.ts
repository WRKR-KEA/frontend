import api from '@/lib/api/axios';
import { AxiosResponse } from 'axios';

const accessToken = sessionStorage.getItem("accessToken");

// (GET) 담당자 티켓 목록 요청
export async function fetchManagerTicketList(
  page?: number,
  size?: number,
  sort?: string,
  status?: string,
  sortType?: string,
  query?: string,
) {
  try {
    const { data } = await api.get(
      `/api/manager/tickets?page=${page}&size=${size}&sort=${sort}&status=${status}&sortType=${sortType}&query=${query}`,
    );
    return data;
  } catch (error) {
    console.error('담당자 티켓 목록 요청에 실패했습니다. :', error);
  }
}

// (GET) 티켓 상세 조회
export async function fetchManagerTicket(ticketId: string) {
  try {
    const { data } = await api.get(`/api/manager/tickets/${ticketId}`, {
      headers: {
        Accept: "application/json;charset=UTF-8",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error) {
    console.error('티켓 상세 조회에 실패했습니다. :', error);
  }
}

// (GET) 부서 전체 티켓 조회 및 검색
export async function fetchManagerDepartmentTicket(
  query?: string,
  status?: string,
  startDate?: string,
  endDate?: string,
  page?: number,
  size?: number,
) {
  try {
    const { data } = await api.get(
     `/api/manager/tickets/department?query=${query}&status=${status}&startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`,
     {
      headers: {
        Accept: "application/json;charset=UTF-8",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return data;
  } catch (error) {
    console.error('부서 전체 티켓 조회 및 검색에 실패했습니다. :', error);
  }
}


// (GET) 부서 전체 티켓 조회 및 검색 결과 엑셀 다운로드
export async function fetchManagerDepartmentTicketExcel(
  query?: string,
  status?: string,
  startDate?: string,
  endDate?: string,
) {
  try {
    const { data } = await api.get(
      `/api/manager/tickets/department/excel?query=${query}&status=${status}&startDate=${startDate}&endDate=${endDate}`, {
        responseType: 'blob',
      },
    );
    console.log(data);
    return data;
  } catch (error) {
    console.error('부서 전체 티켓 조회 및 검색 결과 엑셀 다운로드에 실패했습니다. :', error);
  }
}

// (GET) 기간별 & 티켓 상태별 티켓 개수 조회
export async function fetchManagerStatistics(
  date: string,
  type: string,
  status: string,
) {
  try {
    let data: AxiosResponse<any, any>;
    if (status == null) {
      data = await api.get(
        `/api/manager/statistics/count?date=${date}&type=${type}&status=REQUEST`,
      );
    } else {
      data = await api.get(
        `/api/manager/statistics/count?date=${date}&type=${type}&status=${status}`,
      );
    }
    return data;
  } catch (error) {
    console.error(
      '기간별 & 티켓 상태별 티켓 개수 조회에 실패했습니다. :',
      error,
    );
  }
}

// (PATCH) 담당자 - 티켓 반려
export async function updateManagerTicketReject(ticketId: string) {
  try {
    const { data } = await api.patch(`/api/manager/tickets/${ticketId}/reject`);
    return data;
  } catch (error) {
    console.error('담당자 - 티켓 반려에 실패했습니다. :', error);
  }
}

// (PATCH) 담당자 - 티켓 완료
export async function updateManagerTicketComplete(ticketId: string) {
  const accessToken = sessionStorage.getItem('accessToken');

  try {
    const { data } = await api.patch(`/api/manager/tickets/${ticketId}/complete`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
    return data;
  } catch (error) {
    console.error('담당자 - 티켓 완료에 실패했습니다. :', error);
  }
}

// (PATCH) 해당 티켓 담당자 변경
export async function updateManagerTicketDelete(ticketId: string) {
  try {
    const { data } = await api.patch(
      `/api/manager/tickets/${ticketId}/delegate`,
    );
    return data;
  } catch (error) {
    console.error('해당 티켓 담당자 변경에 실패했습니다. :', error);
  }
}

// (PATCH) 해당 티켓 상단 고정
export async function updateManagerTicketPin(ticketData: {
  managerId: string;
  ticketId: string;
}) {
  try {
    const { data } = await api.patch(`/api/manager/tickets/pin`, ticketData);
    return data;
  } catch (error) {
    console.error('해당 티켓 상단 고정에 실패했습니다. :', error);
  }
}

// (PATCH) 담당자 - 티켓 승인
export async function updateManagerTicketApprove(ticketId: string) {
  try {
    const { data } = await api.patch(
      `/api/manager/tickets/approve?ticketId=${encodeURIComponent(ticketId)}`
    );
    return data;
  } catch (error) {
    console.error('담당자 - 티켓 승인에 실패했습니다. :', error);
    throw error;
  }
}

// (POST) 카테고리별 통계 조회
export async function postManagerStatistics(
  statisticsType: string,
  statisticsData: { date: string },
) {
  try {
    const { data } = await api.post(
      `/api/manager/statistics/${statisticsType}`,
      statisticsData,
    );
    return data;
  } catch (error) {
    console.error('카테고리별 통계 조회에 실패했습니다. :', error);
  }
}

export async function postSecondCategoryManagerStatistics(
  statisticsType: string,
  parentCategoryId: string,
  statisticsData: { date: string },
) {
  try {
    const { data } = await api.post(
      `/api/manager/statistics/${statisticsType}/${parentCategoryId}`,
      statisticsData,
    );
    return data;
  } catch (error) {
    console.error('카테고리별 통계 조회에 실패했습니다. :', error);
  }
}

export async function getTicketStatusSummery(
  statisticsType: string,
  date: string,
) {
  try {
    const { data } = await api.get(
      `/api/manager/statistics/${statisticsType}/status?date=${date}`,
    );
    console.log(data);
    return data;
  } catch (error) {
    console.error('티켓 상태별 요약 조회에 실패했습니다. :', error);
  }
}


// (GET) 매니저 홈 티켓 목록 조회
export async function fetchManagerTickets() {
  const accessToken = sessionStorage.getItem("accessToken");
  try {
    const { data } = await api.get(`/api/manager/tickets/main`, {
      headers: {
        Accept: "application/json;charset=UTF-8",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error) {
    console.error("티켓 정보를 불러오는 중 오류가 발생했습니다. :", error);
    throw error;
  }
}
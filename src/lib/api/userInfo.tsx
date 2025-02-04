import axios from 'axios';

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const BASE_URL = "http://172.16.211.53:8080";

const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInR5cGUiOiJBQ0NFU1MiLCJzdWIiOiJ1c2VyLmN5dyIsImV4cCI6MTc0MDMxMDg0N30.YdTnsOwMVORmdhwmw6pM5IC1CWK-2BVRvyPEgfjQdOI";

// 사용자 마이페이지 조회 API
export async function fetchMyPage(memberId: string) {
  const url = `${BASE_URL}/api/user/my-page/${memberId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json;charset=UTF-8',
        authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "마이페이지 정보를 불러오는데 실패했습니다.");
  }
}

// 사용자 마이페이지 정보 수정 API
export async function updateMyPage(memberId: string, updateData: { position?: string; phone?: string }) {
  const url = `${BASE_URL}/api/user/my-page/${memberId}`;

  try {
    const response = await axios.patch(url, updateData, {
      headers: {
        'Accept': 'application/json;charset=UTF-8',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "마이페이지 정보 수정에 실패했습니다.");
  }
}
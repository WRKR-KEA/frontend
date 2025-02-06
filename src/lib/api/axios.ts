import axios, { AxiosInstance } from "axios";

const BASE_URL = "http://172.16.211.53:8080";
const accessToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInR5cGUiOiJBQ0NFU1MiLCJzdWIiOiJ1c2VyLmN5dyIsImV4cCI6MTc0MDMxMDg0N30.YdTnsOwMVORmdhwmw6pM5IC1CWK-2BVRvyPEgfjQdOI";

// 최상위에 .env 파일을 만들고
// NEXT_PUBLIC_BASE_URL='http://172.16.211.53:8080/' 를 추가한 다음 아래의 주석을 풀어주세요
const apiConfig = {
  backend: {
    // baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    baseURL: BASE_URL,
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

export default api;

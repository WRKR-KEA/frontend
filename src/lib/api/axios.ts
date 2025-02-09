'use client';


import axios, { AxiosInstance } from 'axios';

const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("accessToken");
  }
  return null;
};

const accessToken = getAccessToken(); // ✅ 안전하게 호출


const apiConfig = {
  backend: {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  },
};

const server = apiConfig.backend.baseURL;

const api: AxiosInstance = axios.create({
  baseURL: server,
  withCredentials: true, // 쿠키를 포함한 인증 정보를 서버에 전송
  headers: {

    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,

  },
});

export default api;

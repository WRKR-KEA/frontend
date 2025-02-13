'use client';

import axios, { AxiosInstance } from 'axios';

// ✅ 안전하게 accessToken을 가져오는 함수
const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("accessToken");
  }
  return null;
};

const apiConfig = {
  backend: {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  },
};

const server = apiConfig.backend.baseURL;

// ✅ 기본 axios 인스턴스 생성 (초기에는 Authorization 헤더 없음)
const api: AxiosInstance = axios.create({
  baseURL: server,
  withCredentials: true, // 쿠키를 포함한 인증 정보를 서버에 전송
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ 요청 인터셉터 추가 (API 요청이 발생할 때마다 accessToken을 동적으로 추가)
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken(); // ✅ 요청 직전에 최신 토큰 가져오기

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // ✅ 동적으로 헤더 추가
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

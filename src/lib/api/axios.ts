'use client';


import axios, { AxiosInstance } from 'axios';

const accessToken = sessionStorage.getItem('accessToken');

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

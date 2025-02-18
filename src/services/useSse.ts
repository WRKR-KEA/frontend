import { useEffect, useState } from 'react';
import { useSSEStore } from '@/stores/sseStore';

const useSSE = () => {
  const { eventSource, connect, disconnect } = useSSEStore();

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');

    if (accessToken) {
      connect(accessToken);
    }
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (eventSource === null) return;
    connect(accessToken);
  }, [eventSource]);
};

export default useSSE;
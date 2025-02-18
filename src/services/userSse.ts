import { useEffect, useState } from 'react';
import { useSSEStore } from '@/stores/sseStore';

const useSSE = () => {
  const accessToken = sessionStorage.getItem('accessToken');
  const { eventSource, connect, disconnect } = useSSEStore();

  useEffect(() => {

    if (accessToken) {
      connect(accessToken);
    }
    return () => {
      disconnect();
    };
  }, [accessToken]);

  useEffect(() => {
    if (eventSource === null) return;
    connect(accessToken);
  }, [eventSource]);
};

export default useSSE;
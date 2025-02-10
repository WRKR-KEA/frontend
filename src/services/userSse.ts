import { EventSourcePolyfill } from 'event-source-polyfill';
import { useEffect } from 'react';
import { useToastStore } from '@/stores/notificationStore';

const useSSE = () => {
  const { addToast } = useToastStore();

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');

    const eventSource = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/sse/subscribe`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Connection: 'keep-alive',
          Accept: 'text/event-stream',
        },
        heartbeatTimeout: 60000,
        withCredentials: true,
      }
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      addToast(data.content, data.type);
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [addToast]);
};

export default useSSE;
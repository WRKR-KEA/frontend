import React, { useEffect } from 'react';
import { useSSEStore } from '@/stores/sseStore';

const Toast: React.FC = () => {
  const { messages, removeMessage } = useSSEStore();

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        removeMessage(messages[0].id);
      }, 3000); // 3초 후 사라짐

      return () => clearTimeout(timer);
    }
  }, [messages]);

  if (messages.length === 0) return null;

  const { id, message, type } = messages[0];

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: type === 'error' ? '#ff6b6b' : '#51cf66',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
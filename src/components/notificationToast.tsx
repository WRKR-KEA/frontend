import React, { useEffect } from 'react';
import { useToastStore } from '../stores/notificationStore';

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        removeToast(toasts[0].id);
      }, 3000); // 3초 후 사라짐

      return () => clearTimeout(timer);
    }
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  const { id, message, type } = toasts[0];

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
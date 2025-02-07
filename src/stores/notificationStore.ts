import { create } from 'zustand';

interface Toast {
    id: string;
    message: string;
    type: string;
  }
  
  interface ToastStore {
    toasts: Toast[];
    addToast: (message: string, type: string) => void;
    removeToast: (id: string) => void;
  }
  
  export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (message, type) =>
      set((state) => ({
        toasts: [...state.toasts, { id: Date.now().toString(), message, type }],
      })),
    removeToast: (id) =>
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      })),
  }));

import { create } from "zustand";

// ✅ User 타입 정의 (사용자 정보에 맞게 확장 가능)
interface User {
  name: string;
  profileImage: string;
  role: string;
  nickname: string;
}

// ✅ Zustand 스토어 타입 정의
interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

// ✅ Zustand 스토어 생성
const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUserStore;

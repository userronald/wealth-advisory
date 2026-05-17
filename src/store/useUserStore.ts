import { create } from 'zustand';
import type { UserProfile } from '@/types';
import { getCurrentUser, saveCurrentUser, clearStorage } from '@/lib/storage';

interface UserState {
  currentUser: UserProfile | null;
  setUser: (user: UserProfile) => void;
  loadUser: () => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  
  setUser: (user) => {
    saveCurrentUser(user);
    set({ currentUser: user });
  },
  
  loadUser: () => {
    const user = getCurrentUser();
    if (user) {
      set({ currentUser: user });
    }
  },
  
  clearUser: () => {
    clearStorage();
    set({ currentUser: null });
  },
}));

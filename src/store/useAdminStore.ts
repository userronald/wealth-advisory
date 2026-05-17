import { create } from 'zustand';
import type { UserProfile, Analytics } from '@/types';
import { getAllUsers, getAnalytics, getSchemeViews } from '@/lib/storage';
import type { SchemeView } from '@/lib/storage';

interface AdminState {
  users: UserProfile[];
  analytics: Analytics[];
  schemeViews: SchemeView[];
  loadUsers: () => void;
  loadAnalytics: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  analytics: [],
  schemeViews: [],
  
  loadUsers: () => {
    const users = getAllUsers();
    set({ users });
  },
  
  loadAnalytics: () => {
    const analytics = getAnalytics();
    const schemeViews = getSchemeViews();
    set({ analytics, schemeViews });
  },
}));

import type { UserProfile, Analytics } from '@/types';

export const STORAGE_KEYS = {
  USER: 'wealth_user',
  USERS: 'wealth_users',
  ANALYTICS: 'wealth_analytics',
  SCHEME_VIEWS: 'wealth_scheme_views',
} as const;

export interface SchemeView {
  schemeId: string;
  userId?: string;
  timestamp: string;
}

// User Storage
export function saveCurrentUser(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving current user:', error);
  }
}

export function getCurrentUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Admin Users List Storage
export function saveUserToAdminList(user: UserProfile): void {
  try {
    const users = getAllUsers();
    const existingIndex = users.findIndex((u) => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving user to admin list:', error);
  }
}

export function getAllUsers(): UserProfile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

// Analytics Storage
export function savePageVisit(analytics: Analytics): void {
  try {
    const existing = getAnalytics();
    
    // Ensure timestamp is properly serialized
    const serializedAnalytics = {
      ...analytics,
      timestamp: analytics.timestamp instanceof Date 
        ? analytics.timestamp.toISOString() 
        : analytics.timestamp
    };
    
    existing.push(serializedAnalytics);
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(existing));
  } catch (error) {
    console.error('Error saving page visit:', error);
  }
}

export function getAnalytics(): Analytics[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting analytics:', error);
    return [];
  }
}

// Scheme Views Storage
export function saveSchemeView(schemeId: string, userId?: string): void {
  try {
    const views = getSchemeViews();
    views.push({
      schemeId,
      userId,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.SCHEME_VIEWS, JSON.stringify(views));
  } catch (error) {
    console.error('Error saving scheme view:', error);
  }
}

export function getSchemeViews(): SchemeView[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEME_VIEWS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting scheme views:', error);
    return [];
  }
}

// Clear Storage
export function clearStorage(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}

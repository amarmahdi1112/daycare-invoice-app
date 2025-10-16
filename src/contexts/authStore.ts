import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

// Simple user storage (in a real app, this would be on a server)
const USERS_STORAGE_KEY = 'invoice-app-users';

const getStoredUsers = (): Record<string, { email: string; password: string; name: string; id: string; createdAt: string }> => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

const saveUser = (email: string, password: string, name: string) => {
  const users = getStoredUsers();
  const id = `user-${Date.now()}`;
  const createdAt = new Date().toISOString();
  
  users[email] = { email, password, name, id, createdAt };
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  return { id, email, name, createdAt };
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const users = getStoredUsers();
        const user = users[email];

        if (user && user.password === password) {
          set({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              createdAt: user.createdAt,
            },
            isAuthenticated: true,
          });
          return true;
        }

        return false;
      },

      signup: async (email: string, password: string, name: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const users = getStoredUsers();

        // Check if user already exists
        if (users[email]) {
          return false;
        }

        // Create new user
        const newUser = saveUser(email, password, name);
        
        set({
          user: newUser,
          isAuthenticated: true,
        });

        return true;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthResponse } from '@/types/auth'

export interface AuthStore {
    user: AuthResponse | null;
    isAuthenticated: boolean;
    // eslint-disable-next-line no-unused-vars
    setAuth: (data: unknown) => void;
    clearAuth: () => void;
  }

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (data: unknown) =>
        set({
          user: data as AuthResponse,
          isAuthenticated: true,
        }),
      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
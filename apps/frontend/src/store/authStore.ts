import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "shared-types";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  hasHydrated: boolean;
  setSession: (user: AuthUser, accessToken: string) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hasHydrated: false,
      setSession: (user, accessToken) => set({ user, accessToken }),
      logout: () => set({ user: null, accessToken: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "clinica-vet-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

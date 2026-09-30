import { create } from "zustand";

interface SidebarState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isMobileDrawerOpen: boolean;
  toggleMobileDrawer: () => void;
  closeMobileDrawer: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  isMobileDrawerOpen: false,
  toggleMobileDrawer: () =>
    set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
  closeMobileDrawer: () => set({ isMobileDrawerOpen: false }),
}));

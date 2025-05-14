import { create } from "zustand";


// Define the store to manage the isMobile state
interface AppState {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  isMobile: false,  // Default value for isMobile
  setIsMobile: (isMobile) => set({ isMobile }),
}));

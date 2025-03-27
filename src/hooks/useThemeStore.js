import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("saas-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("saas-theme", theme);
    set({ theme });
  },
}));

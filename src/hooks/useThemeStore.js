import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("saas-themes") || "night",
  setTheme: (theme) => {
    localStorage.setItem("saas-themes", theme);
    set({ theme });
  },
}));

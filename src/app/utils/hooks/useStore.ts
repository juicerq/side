import { User } from "@/server/db/ZSchemasAndTypes";
import { create } from "zustand";

type Store = {
  isLoading: boolean;
  user: User | undefined;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: User) => void;
};

export const useStore = create<Store>((set) => ({
  user: undefined,
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setUser: (user: User) => set({ user }),
}));

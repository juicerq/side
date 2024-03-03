import { User } from "@/server/db/ZSchemasAndTypes";
import { create } from "zustand";

type Store = {
  user: User | undefined;
  setUser: (user: User) => void;
};

export const useStore = create<Store>((set) => ({
  user: undefined,
  setUser: (user: User) => set({ user }),
}));

import { create } from "zustand";

interface SetupState {
  isSetup: boolean;
  setIsSetup: (value: boolean) => void;
}

export const useIsSetup = create<SetupState>((set) => ({
  isSetup: true,
  setIsSetup: (value: boolean) => set(() => ({ isSetup: value })),
}));

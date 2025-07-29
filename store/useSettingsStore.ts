import { AgeRange } from '@/constants/Settings';
import { create } from 'zustand';

export interface UserSettings {
  age: AgeRange | null;
  language: string | null;
  lastUpdated: string;
}

interface SettingsState {
  age: AgeRange | null;
  language: string | null;
  setAge: (age: AgeRange | null) => void;
  setLanguage: (language: string | null) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  age: null,
  language: null,
  setAge: (age) => set({ age }),
  setLanguage: (language) => set({ language }),
}));

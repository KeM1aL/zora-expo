import { AgeRange } from "@/constants/Settings";

export interface UserSettings {
  ageRange: AgeRange | null;
  language: string;
  lastUpdated: string;
}
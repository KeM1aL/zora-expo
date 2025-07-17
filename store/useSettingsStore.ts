import { AgeRange } from "@/constants/Settings";

export interface UserSettings {
  ageRange: AgeRange | null;
  language: string | null;
  lastUpdated: string;
}

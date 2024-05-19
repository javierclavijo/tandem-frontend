import { LabelOption } from "./components/Select/types";
import {
  Language,
  LanguageInfo,
  NonNativeProficiencyLevel,
  OptionsObject,
  ProficiencyLevel,
} from "./types";

export const COLORS: Readonly<Record<string, string>> = {
  DARK_PRIMARY: "#00638B",
  PRIMARY: "#287FA4",
  SECONDARY: "#8DD9F7",
  CONTRAST: "#DC2626",
  LIGHT: "#EDF6FA",
  DARK: "#333333",
  WHITE: "#FFFFFF",
};

export const FONT_SIZES: Readonly<Record<string, string>> = {
  S: "0.875rem",
  M: "1rem",
  L: "1.5rem",
  XL: "2rem",
};

export const LANGUAGE_INFO: Readonly<Record<Language, LanguageInfo>> = {
  DE: { flagIconCode: "DE", displayName: "German" },
  EN: { flagIconCode: "GB", displayName: "English" },
  FR: { flagIconCode: "FR", displayName: "French" },
  IT: { flagIconCode: "IT", displayName: "Italian" },
  ES: { flagIconCode: "ES", displayName: "Spanish" },
};

export const LEVEL_NAMES: Readonly<Record<ProficiencyLevel, string>> = {
  BE: "Beginner",
  IN: "Intermediate",
  AD: "Advanced",
  NA: "Native",
};

export const languageOptions: OptionsObject<Language> = {
  EN: { value: "EN", label: "English" },
  FR: { value: "FR", label: "French" },
  DE: { value: "DE", label: "German" },
  IT: { value: "IT", label: "Italian" },
  ES: { value: "ES", label: "Spanish" },
};

export const languageKeys: string[] = [...Object.keys(languageOptions)];

export const languageOptionsArray: LabelOption<Language>[] = [
  ...Object.values(languageOptions),
];

export const levelOptions: OptionsObject<NonNativeProficiencyLevel> = {
  BE: { value: "BE", label: "Beginner" },
  IN: { value: "IN", label: "Intermediate" },
  AD: { value: "AD", label: "Advanced" },
};

export const levelKeys: string[] = [...Object.keys(levelOptions)];

export const levelOptionsArray: LabelOption<NonNativeProficiencyLevel>[] = [
  ...Object.values(levelOptions),
];

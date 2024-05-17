import { Language, LanguageInfo, Option, ProficiencyLevel } from "./types";

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

export const LANGUAGE_OPTIONS: Option<Language>[] = [
  { value: "EN", label: "English" },
  { value: "FR", label: "French" },
  { value: "DE", label: "German" },
  { value: "IT", label: "Italian" },
  { value: "ES", label: "Spanish" },
];

export const LEVEL_OPTIONS: Option<ProficiencyLevel>[] = [
  { value: "BE", label: "Beginner" },
  { value: "IN", label: "Intermediate" },
  { value: "AD", label: "Advanced" },
];

import { Language, LanguageInfo, Option, ProficiencyLevel } from "../types";

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

export const languageOptions: Option<Language>[] = [
  { value: "EN", label: "English" },
  { value: "FR", label: "French" },
  { value: "DE", label: "German" },
  { value: "IT", label: "Italian" },
  { value: "ES", label: "Spanish" },
];

export const levelOptions: Option<ProficiencyLevel>[] = [
  { value: "BE", label: "Beginner" },
  { value: "IN", label: "Intermediate" },
  { value: "AD", label: "Advanced" },
];

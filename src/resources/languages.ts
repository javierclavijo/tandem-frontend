import { FlagIconCode } from "react-flag-kit";

export const languages = [
  { key: "DE", value: "German" },
  { key: "EN", value: "English" },
  { key: "FR", value: "French" },
  { key: "IT", value: "Italian" },
  { key: "ES", value: "Spanish" },
];

export const levels = [
  { key: "BE", value: "Beginner" },
  { key: "IN", value: "Intermediate" },
  { key: "AD", value: "Advanced" },
  { key: "NA", value: "Native" },
];

export const flagCodes: { key: string; value: FlagIconCode }[] = [
  { key: "DE", value: "DE" },
  { key: "EN", value: "GB" },
  { key: "FR", value: "FR" },
  { key: "IT", value: "IT" },
  { key: "ES", value: "ES" },
];

export interface Option {
  value: string;
  label: string;
}

export const languageOptions: Option[] = [
  { value: "EN", label: "English" },
  { value: "FR", label: "French" },
  { value: "DE", label: "German" },
  { value: "IT", label: "Italian" },
  { value: "ES", label: "Spanish" },
];

export const levelOptions: Option[] = [
  { value: "BE", label: "Beginner" },
  { value: "IN", label: "Intermediate" },
  { value: "AD", label: "Advanced" },
];

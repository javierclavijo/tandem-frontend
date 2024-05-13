import { Language, ProficiencyLevel } from "../common/types";

export interface UserLanguage {
  id: string;
  url: string;
  language: Language;
  level: ProficiencyLevel;
}

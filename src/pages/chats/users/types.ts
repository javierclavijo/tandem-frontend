import { Language, ProficiencyLevel } from "../../../common/types";

export interface SetPasswordRequestData {
  newPassword: string;
  oldPassword: string;
}

export interface CreateUserLanguageRequestData {
  language: Language;
  level: ProficiencyLevel;
  user: string;
}

export interface UpdateUserLanguageRequestData {
  level: ProficiencyLevel;
}

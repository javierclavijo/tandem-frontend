import { Language, Option, ProficiencyLevel } from "../../../../common/types";

export interface ChannelCreationRequest {
  name: string;
  language: string;
  level: ProficiencyLevel;
}

export interface ChannelCreationFormValues {
  name: string;
  language: Option<Language> | null;
  level: Option<ProficiencyLevel> | null;
}

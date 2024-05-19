import { LabelOption } from "../../../../common/components/Select/types";
import { Language, NonNativeProficiencyLevel } from "../../../../common/types";

export interface ChannelCreationRequest {
  name: string;
  language: string;
  level: NonNativeProficiencyLevel;
}

export interface ChannelCreationFormValues {
  name: string;
  language: LabelOption<Language> | null;
  level: LabelOption<NonNativeProficiencyLevel> | null;
}

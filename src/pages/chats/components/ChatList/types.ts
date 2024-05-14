import { ProficiencyLevel } from "../../../../common/types";

export interface ChannelCreationRequest {
  name: string;
  language: string;
  level: ProficiencyLevel;
}

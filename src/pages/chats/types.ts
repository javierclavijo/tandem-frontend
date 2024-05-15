import { To } from "react-router-dom";
import { Language, ProficiencyLevel } from "../../common/types";

export interface ChatMessage {
  id: string;
  url: string;
  author: {
    id: string;
    url: string;
    username: string;
  };
  content: string;
  timestamp: string;
  chat_id: string;
}

export interface ChatMessageResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChatMessage[];
  nextPageNumber: number | null;
  previousPageNumber: number | null;
}

export interface WsChatMessage {
  message: ChatMessage;
}

export interface UserLanguage {
  id: string;
  url: string;
  language: Language;
  level: ProficiencyLevel;
}
export type UpdateChannelDescriptionQueryKey = "users" | "channels";

export interface UpdateChannelDescriptionRequest {
  description: string;
}

export interface ChatHeaderData {
  title?: string;
  link?: To;
  image?: string | null;
  actions?: JSX.Element;
}

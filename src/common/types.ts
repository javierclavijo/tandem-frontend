import { Interpolation, Theme } from "@emotion/react";
import { FlagIconCode } from "react-flag-kit";
import { FieldPath, FieldValues } from "react-hook-form";
import { ChatMessage, ChatType, UserLanguage } from "../pages/chats/types";

export type NonNativeProficiencyLevel = "BE" | "IN" | "AD";
export type ProficiencyLevel = NonNativeProficiencyLevel | "NA";
export type Language = "DE" | "EN" | "FR" | "IT" | "ES";
export type UserRole = "U" | "M" | "A";

interface ChannelMembershipUser {
  id: string;
  url: string;
  username: string;
  description: string;
  image: string | null;
}

interface ChannelMembership {
  id: string;
  url: string;
  user: ChannelMembershipUser;
  role: UserRole;
}

export interface Channel extends Chat {
  description: string;
  language: Language;
  level: ProficiencyLevel;
  memberships: ChannelMembership[];
  type: "channels";
}

interface UserMembershipChannel {
  id: string;
  url: string;
  name: string;
  description: string;
  language: Language;
  level: ProficiencyLevel;
  image: string | null;
}

interface UserMembership {
  id: string;
  url: string;
  channel: UserMembershipChannel;
  role: string;
}

export interface User {
  id: string;
  url: string;
  username: string;
  description: string;
  friend_chats: FriendChat[];
  languages: UserLanguage[];
  memberships: UserMembership[];
  image: string;
}

export interface Chat {
  id: string;
  url: string;
  messages: ChatMessage[];
  image: string | null;
  type: ChatType;
  name: string;
  // Contains the URL for the endpoint to fetch the channel's chat messages
  messageUrl: string;
  // Convenience attribute used to have a uniform accessor to the chat's user or channel
  infoUrl: string;
}

export interface FriendChat extends Chat {
  users: User[];
  type: "users";
}

export interface LanguageInfo {
  flagIconCode: FlagIconCode;
  displayName: string;
}

export interface Option<T extends string = string> {
  value: T;
  label: string;
}

export type ServerErrorResponse = Readonly<Record<string, string[]>>;

export type UseFormSetErrorName<TData extends FieldValues> =
  | FieldPath<TData>
  | `root.${string}`
  | "root";

export interface StyledEmotionComponentProps {
  css?: Interpolation<Theme>;
}

export type ImgProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export type OptionsObject<TData extends string> = Readonly<
  Record<TData, Option<TData>>
>;

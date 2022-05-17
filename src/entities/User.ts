import { FriendChat } from "./Chat";

export interface UserLanguage {
  id: string;
  url: string;
  language: string;
  level: string;
}

export interface UserMembershipChannel {
  id: string;
  url: string;
  name: string;
  description: string;
  language: string;
  level: string;
  image: string | null;
}

export interface UserMembership {
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

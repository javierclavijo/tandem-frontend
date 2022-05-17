import { ChatMessage } from "./ChatMessage";
import { User } from "./User";

export interface Chat {
  id: string;
  url: string;
  messages: ChatMessage[];
  image: string | null;
  type: "users" | "channels";
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

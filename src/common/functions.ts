import { ChatMessage } from "../pages/chats/types";
import { User } from "./types";

export const getChatLastMessageDisplayText = (
  lastMessage: ChatMessage | undefined,
  appUser: User | undefined,
) => {
  const isOwnMessage = lastMessage?.author.id === appUser?.id;
  const lastMessageAuthorName = lastMessage?.author.username;
  const lastMessageText = lastMessage?.content;
  return `${isOwnMessage ? "You" : lastMessageAuthorName}: ${lastMessageText}`;
};

import {ChatMessage} from "./ChatMessage";
import {User} from "./User";
import {Channel} from "./Channel";

export interface Chat extends UserChat, Channel {
    id: string,
    url: string,
    messages: ChatMessage[]
    infoUrl: string;
    name: string,
    type: "users" | "channels",
    messageUrl: string
}

export interface UserChat {
    id: string,
    url: string,
    users: User[],
    messages: ChatMessage[],
    // Convenience attributes which contain info about the chat's channel or user, plus the endpoint to fetch the chat's
    // messages
    name: string,
    infoUrl: string,
    messageUrl: string,
    // Type attribute, must be 'user' in practice. Set to 'user' | 'channel' to be able to use it in the Chat
    // interface.
    type: "users" | "channels",
}
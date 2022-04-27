import {ChatMessage} from "./ChatMessage";
import {User} from "./User";
import {Channel} from "./Channel";

export interface Chat extends UserChat, Channel {
    id: string,
    url: string,
    messages: ChatMessage[]
    info_url: string;
    name: string,
    type: "users" | "channels",
}

export interface UserChat {
    id: string,
    url: string,
    users: User[],
    messages: ChatMessage[],
    // Convenience attributes which contain info about the chat's channel or user
    info_url: string,
    name: string,
    // Type attribute, must be 'user' in practice. Set to 'user' | 'channel' to be able to use it in the Chat
    // interface.
    type: "users" | "channels",
}
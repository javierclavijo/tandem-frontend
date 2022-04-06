import {ChatMessage} from "./ChatMessage";

export interface Chat {
    id: string,
    url: string,
    name: string,
    chat_type: "user" | "channel",
    messages: ChatMessage[]
}

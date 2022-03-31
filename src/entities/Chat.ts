import {ChatMessage} from "./ChatMessage";

export interface Chat {
    id: string,
    url: string,
    name: string,
    messages: ChatMessage[]
}

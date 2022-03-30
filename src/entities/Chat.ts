import {ChatMessage} from "./ChatMessage";

export interface Chat {
    id: number,
    url: string,
    name: string,
    messages: ChatMessage[]
}

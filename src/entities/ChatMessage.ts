export interface ChatMessage {
    id: string,
    url: string,
    author: {
        id: string,
        url: string,
        username: string
    },
    content: string,
    timestamp: string
}

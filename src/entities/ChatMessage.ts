export interface ChatMessage {
    id: string,
    url: string,
    author: {
        id: number,
        url: string,
        username: string
    },
    content: string,
    timestamp: string
}

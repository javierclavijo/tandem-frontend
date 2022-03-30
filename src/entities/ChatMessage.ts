export interface ChatMessage {
    id: number,
    url: string,
    author: {
        id: number,
        url: string,
        username: string
    },
    content: string,
    timestamp: string
}

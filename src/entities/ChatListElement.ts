export interface ChatListElement {
    url:string,
    name:string,
    latest_message: {
        content:string,
        timestamp:string,
        author:string
    }
}

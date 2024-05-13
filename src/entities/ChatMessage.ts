export interface ChatMessage {
  id: string;
  url: string;
  author: {
    id: string;
    url: string;
    username: string;
  };
  content: string;
  timestamp: string;
  chat_id: string;
}

export interface ChatMessageResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChatMessage[];
  nextPageNumber: number | null;
  previousPageNumber: number | null;
}

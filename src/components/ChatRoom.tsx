import React, {useCallback, useState} from "react";
import BackButton from "./BackButton";
import {useParams} from "react-router-dom";
import useWebSocket from "react-use-websocket";
import {useChatList} from "../app/hooks/chat";
import {Chat} from "../entities/Chat";
import {useQuery} from "react-query";
import useAuth, {axiosApi} from "../app/AuthContext";

function ChatRoom() {
    const params = useParams();
    const {token} = useAuth();
    const [inputValue, setInputValue] = useState<string>("");

    const {data: chatList} = useChatList();
    const [chatUrl, setChatUrl] = useState<string>("");
    const [chatId, setChatId] = useState<string>("");

    const {data} = useQuery<Chat>(["chats", "detail", chatId], async () => {
        const response = await axiosApi.get(chatUrl);
        return response.data;
    }, {
        enabled: Boolean(chatUrl) && Boolean(chatId),
        staleTime: 15000
    });

    React.useEffect(() => {
        // Fetch the resource's URL and ID from the chat list
        const chatResult = chatList?.find(c => c.id === params.id);
        if (chatResult) {
            setChatUrl(chatResult.url);
            setChatId(chatResult.id);
        }
    }, [chatList, params.id]);

    const {
        sendJsonMessage,
    } = useWebSocket(`${process.env.REACT_APP_WS_URL}/ws/chats/?${token}`, {
        onClose: () => console.error("Chat socket closed unexpectedly"),
        shouldReconnect: (closeEvent) => true,
        share: true
    });

    const handleSend = useCallback(() => {
        const message = {
            chat_id: chatId,
            content: inputValue
        };
        sendJsonMessage(message);
        setInputValue("");
    }, [chatId, inputValue, sendJsonMessage]);

    return (
        <div>
            <ul>
                {data?.messages.map(message => (
                    <li key={message.id}>{message.author.username}: {message.content} ({message.timestamp})</li>
                ))}
            </ul>
            <input type="text" id="chat-text-input"
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="button" id="chat-send"
                    onClick={handleSend}
            >Send
            </button>
            <BackButton/>
        </div>
    );
}

export default ChatRoom;

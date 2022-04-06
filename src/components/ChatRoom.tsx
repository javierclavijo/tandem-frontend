import React, {useCallback, useState} from "react";
import BackButton from "./BackButton";
import {useParams} from "react-router-dom";
import useWebSocket from "react-use-websocket";
import {messageSortFn, useChatList} from "../app/hooks/chat";
import {Chat} from "../entities/Chat";
import {useQuery} from "react-query";
import useAuth, {axiosApi} from "../app/AuthContext";

function ChatRoom() {
    const params = useParams();
    const {token} = useAuth();
    const [inputValue, setInputValue] = useState<string>("");

    const {data: chatList} = useChatList();
    const [chat, setChat] = useState<Chat>({} as Chat);

    const {data} = useQuery<Chat>(["chats", "detail", chat.id], async () => {
        const response = await axiosApi.get(chat.url);
        return response.data;
    }, {
        enabled: Boolean(chat.id),
        staleTime: 15000,
        // Sort messages whenever query data changes
        onSuccess: (data) => data.messages.sort((a, b) => messageSortFn(a, b)).reverse(),
    });

    React.useEffect(() => {
        // Fetch the resource's URL and ID from the chat list
        const chatResult = chatList?.find(c => c.id === params.id);
        if (chatResult) {
            setChat(chatResult);
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
            chat_id: chat.id,
            content: inputValue,
            chat_type: chat.chat_type
        };
        sendJsonMessage(message);
        setInputValue("");
    }, [chat, inputValue, sendJsonMessage]);

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

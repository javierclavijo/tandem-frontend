import React, {useCallback, useEffect, useState} from "react";
import BackButton from "./BackButton";
import {useParams} from "react-router-dom";
import useWebSocket from "react-use-websocket";
import {useChatList} from "../app/hooks/useChatList";
import {Chat} from "../entities/Chat";

function ChatMain() {
    const params = useParams();
    const [newMessages, setNewMessages] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    const data = useChatList();
    const [chat, setChat] = useState<Chat>({
        id: "",
        url: "",
        name: "",
        messages: []
    });

    React.useEffect(() => {
        debugger
        const chatResult = data.find(c => c.id === params.id);
        if (chatResult) {
            setChat(chatResult);
        }
    }, [data, params.id]);


    const {
        sendJsonMessage,
        lastJsonMessage
    } = useWebSocket(`${process.env.REACT_APP_WS_URL}/ws/chats/${params.id}/`, {
        onClose: () => console.error("Chat socket closed unexpectedly"),
        share: true
    });

    const handleSend = useCallback(() => {
        sendJsonMessage({message: inputValue});
        setInputValue("");
    }, [inputValue, sendJsonMessage]);

    useEffect(() => {
        if (lastJsonMessage !== null) {
            setNewMessages(prevState => prevState.concat(lastJsonMessage.message));
        }
    }, [lastJsonMessage]);

    return (
        <div>
            <ul>
                {chat?.messages.map(message => (
                    <li key={message.id}>{message.author.username}: {message.content} ({message.timestamp})</li>
                ))}
                {newMessages.map((message, index) => (
                    <li key={index}>{message}</li>
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

export default ChatMain;

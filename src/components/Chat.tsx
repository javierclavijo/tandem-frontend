import React, {useCallback, useEffect, useState} from "react";
import BackButton from "./BackButton";
import {api} from "../app/services/api";
import {useParams} from "react-router-dom";
import useWebSocket from "react-use-websocket";

function Chat() {
    const params = useParams();
    const [newMessages, setNewMessages] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    const {chat} = api.useGetChatListQuery(undefined, {
        selectFromResult: ({data}) => ({
            chat: data?.find(c => c.id === params.id)
        })
    });

    const {
        sendJsonMessage,
        lastJsonMessage
    } = useWebSocket(`${process.env.REACT_APP_WS_URL}/ws/chat/${params.id}/`, {
        onClose: () => console.error("Chat socket closed unexpectedly")
    });

    const handleSend = useCallback(() => {
        sendJsonMessage({message: inputValue});
        setInputValue("");
    }, [inputValue]);

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

export default Chat;

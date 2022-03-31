import React from "react";
import BackButton from "./BackButton";
import {api} from "../app/services/api";
import {useParams} from "react-router-dom";

function Chat() {
    const params = useParams();
    const {chat} = api.useGetChatListQuery(undefined, {
        selectFromResult: ({data}) => ({
            chat: data?.find(c => c.id === params.id)
        })
    });

    return (
        <div>
            <ul>
                {chat?.messages.map(message => (
                    <li key={message.id}>{message.author.username}: {message.content} ({message.timestamp})</li>
                ))}
            </ul>
            <input type="text" id="chat-text-input"/>
            <button type="button" id="chat-send">Send</button>
            <BackButton/>
        </div>
    );
}

export default Chat;

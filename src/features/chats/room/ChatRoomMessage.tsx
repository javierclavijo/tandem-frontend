import React from "react";
import {ChatMessage} from "../../../entities/ChatMessage";

function ChatRoomMessage({message}: { message: ChatMessage }) {
    return (
        <div>{message.author.username}: {message.content} ({message.timestamp})</div>
    );
}

export default ChatRoomMessage;
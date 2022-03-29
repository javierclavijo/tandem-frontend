import React, {useState} from 'react';
import useAsyncEffect from "use-async-effect";
import axios from "axios";
import {ChatListElement} from "../entities/ChatListElement";

function ChatList() {

    const [chats, setChats] = useState<ChatListElement[]>([])

    const getChats = async () => {
        const response = await axios.get(process.env.REACT_APP_API_URL! + '/chat-list', {
            auth: {
                username: 'alamotere',
                password: 'password'
            }
        })
        setChats(response.data.chats)
    }

    useAsyncEffect(getChats, [])

    return (
        <div>
            <ul>
                {chats.map(chat => (
                    <li><a
                        href={chat.url}>{chat.name}</a> - {chat.latest_message.content} ({chat.latest_message.author}, {chat.latest_message.timestamp})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatList;

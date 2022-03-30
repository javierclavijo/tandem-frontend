import React, {useState} from "react";
import useAsyncEffect from "use-async-effect";
import axios from "axios";
import {ChatListElement} from "../entities/ChatListElement";
import {useNavigate} from "react-router-dom";
import {useAppSelector} from "../app/hooks";
import {selectToken} from "../app/authSlice";


function ChatList() {

    const [chats, setChats] = useState<ChatListElement[]>([]);
    const token = useAppSelector(selectToken);
    const navigate = useNavigate();

    const getChats = async () => {
        const response = await axios.get(process.env.REACT_APP_API_URL! + "/chat-list", {
            headers: {
                "Authorization": `Token ${token}`
            }
        });
        setChats(response.data.chats);
    };

    useAsyncEffect(async () => {
        if (token) {
            await getChats();
        } else {
            navigate("/");
        }
    }, []);

    return (
        <div>
            <ul>
                {chats.map(chat => (
                    <li key={chat.url}><a
                        href={chat.url}>{chat.name}</a> - {chat.latest_message.content} ({chat.latest_message.author}, {chat.latest_message.timestamp})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatList;

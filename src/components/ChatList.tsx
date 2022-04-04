import React from "react";
import {Link, Outlet} from "react-router-dom";
import {useChatList} from "../app/hooks/chat";


function ChatList() {
    const data = useChatList();

    return (
        <div>
            <ul>
                {data?.map(chat => {
                    const latestMessage = chat.messages[0];
                    return (
                        <li key={chat.url}>
                            <Link to={`/chats/${chat.id}`}>{chat.name}</Link>
                            - {latestMessage.author.username}: {latestMessage.content} ({latestMessage.timestamp})
                        </li>
                    );
                })}
            </ul>
            <Outlet/>
        </div>
    );
}

export default ChatList;

import React from "react";
import {useGetChatListQuery} from "../app/services/api";
import {Link, Outlet} from "react-router-dom";


function ChatList() {

    const {data: channelChatData} = useGetChatListQuery();

    return (
        <div>
            <ul>
                {channelChatData?.map(chat => {
                    const latestMessage = chat.messages[0];
                    return (
                        <li key={chat.url}>
                            <Link
                                to={`/chats/${chat.id}`}>{chat.name}</Link> - {latestMessage.author.username}: {latestMessage.content} ({latestMessage.timestamp})
                        </li>
                    );
                })}
            </ul>
            <Outlet/>
        </div>
    );
}

export default ChatList;

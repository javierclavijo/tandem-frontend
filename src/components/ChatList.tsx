import React from "react";
import {useGetChatListQuery} from "../app/services/api";


function ChatList() {

    const {data: channelChatData} = useGetChatListQuery();

    return (
        <div>
            <ul>
                {channelChatData?.map(chat => {
                    const latestMessage = chat.messages[0];
                    return (
                        <li key={chat.url}>
                            <a href={chat.url}>{chat.name}</a> - {latestMessage.author.username}: {latestMessage.content} ({latestMessage.timestamp})
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default ChatList;

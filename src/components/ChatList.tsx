import React from "react";
import {Link, Outlet} from "react-router-dom";
import {useQuery} from "react-query";
import {axiosApi} from "../app/AuthContext";
import {Chat} from "../entities/Chat";


function ChatList() {
    const fetchChannelChatList = async () => {
        const response = await axiosApi.get(process.env.REACT_APP_API_URL + "/channel_chats");
        return response.data.results;
    };
    const fetchUserChatList = async () => {
        const response = await axiosApi.get(process.env.REACT_APP_API_URL + "/user_chats");
        return response.data.results;
    };

    const {data} = useQuery<Chat[]>({queryKey: ["chats", "channel"], queryFn: fetchChannelChatList});


    return (
        <div>
            <ul>
                {data?.map(chat => {
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

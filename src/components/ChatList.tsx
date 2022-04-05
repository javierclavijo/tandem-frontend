import React, {useEffect} from "react";
import {Link, Outlet} from "react-router-dom";
import useWebSocket from "react-use-websocket";
import useAuth from "../app/AuthContext";
import {useQueryClient} from "react-query";
import {useChatList} from "../app/hooks/chat";


function ChatList() {
    const {token} = useAuth();
    const queryClient = useQueryClient();

    const {data} = useChatList()

    const {
        lastJsonMessage
    } = useWebSocket(`${process.env.REACT_APP_WS_URL}/ws/chats/?${token}`, {
        onClose: () => console.error("Chat socket closed unexpectedly"),
        shouldReconnect: (closeEvent) => true,
        share: true
    });

    useEffect(() => {
        if (lastJsonMessage !== null) {
            const message = lastJsonMessage.message;
            queryClient.invalidateQueries("chats");

        }
    }, [lastJsonMessage]);

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

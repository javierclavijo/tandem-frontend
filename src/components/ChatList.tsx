import React, {useEffect} from "react";
import {Link, Outlet} from "react-router-dom";
import useWebSocket from "react-use-websocket";
import useAuth from "../app/AuthContext";
import {useQueryClient} from "react-query";
import {useChatList} from "../app/hooks/chat";
import {Chat} from "../entities/Chat";


function ChatList() {
    const {token} = useAuth();
    const queryClient = useQueryClient();

    const {data} = useChatList();

    const {
        lastJsonMessage
    } = useWebSocket(`${process.env.REACT_APP_WS_URL}/ws/chats/?${token}`, {
        onClose: () => console.error("Chat socket closed unexpectedly"),
        shouldReconnect: (closeEvent) => true,
        share: true
    });

    useEffect(() => {
        if (lastJsonMessage !== null) {
            // Whenever a message is received, update both the chat list query and the chat detail queries with the new
            // message.
            const message = lastJsonMessage.message;

            queryClient.setQueryData<Chat[] | undefined>(["chats", "list"], (old) => {
                if (old !== undefined) {
                    const oldChat = old.find(c => c.id === message.chat_id);
                    if (oldChat) {
                        oldChat.messages = [message];
                    }
                }
                return old;
            });

            queryClient.setQueryData<Chat | undefined>(["chats", "detail", message.chat_id], (old) => {
                    if (old !== undefined) {
                        old.messages.push(message);
                    }
                    return old;
                }
            );
        }
    }, [lastJsonMessage, queryClient]);

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

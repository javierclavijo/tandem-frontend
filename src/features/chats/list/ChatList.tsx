/** @jsxImportSource @emotion/react */

import React, {useEffect} from "react";
import {Outlet} from "react-router-dom";
import useWebSocket from "react-use-websocket";
import useAuth from "../../auth/AuthContext";
import {useQueryClient} from "react-query";
import {useChatList} from "../hooks";
import {Chat} from "../../../entities/Chat";
import {listCss, mainCss, searchFormCss, searchInputCss, ulCss} from "./styles";
import ChatListElement from "./ChatListElement";


function ChatList() {
    const {token} = useAuth();
    const queryClient = useQueryClient();
    const {data} = useChatList();

    const [filter, setFilter] = React.useState<string>("");

    const {
        lastJsonMessage
    } = useWebSocket(`${process.env.REACT_APP_WS_URL}/ws/chats/?${token}`, {
        onClose: () => console.error("Chat socket closed unexpectedly"),
        shouldReconnect: (closeEvent) => true,
        share: true
    });

    useEffect(() => {
        if (!lastJsonMessage) {
            return;
        }

        const message = lastJsonMessage.message;
        if (message) {
            // Whenever a message is received, update both the chat list query and the chat detail queries with the new
            // message.
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
        <main css={mainCss}>
            <section css={listCss}>
                <form css={searchFormCss}>
                    <input type="text"
                           css={searchInputCss}
                           onChange={(e) => setFilter(e.target.value)}
                           placeholder="Search..."
                    />
                </form>
                <div css={ulCss}>
                    {data?.map(chat =>
                        <ChatListElement key={chat.id} chat={chat}/>
                    )}
                </div>
            </section>
            <Outlet/>
        </main>
    );
}

export default ChatList;
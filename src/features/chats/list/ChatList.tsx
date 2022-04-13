/** @jsxImportSource @emotion/react */

import React, {useEffect} from "react";
import {Outlet, useParams} from "react-router-dom";
import useWebSocket from "react-use-websocket";
import useAuth from "../../auth/AuthContext";
import {useQueryClient} from "react-query";
import {useChatList} from "../hooks";
import {Chat} from "../../../entities/Chat";
import {listContainerCss, mainCss, listElementContainerCss, mainCssMobile, listContainerCssMobile} from "./styles";
import ChatListElement from "./ChatListElement";
import ChatListFilter from "./ChatListFilter";
import {useMediaQuery} from "react-responsive";


function ChatList() {
    const {token} = useAuth();
    const queryClient = useQueryClient();
    const {data} = useChatList();
    const params = useParams();
    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

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

    return isDesktop ?
        (<main css={mainCss}>
            <section css={listContainerCss}>
                <ChatListFilter setFilter={setFilter}/>
                <div css={listElementContainerCss}>
                    {data?.filter(chat => filter ? chat.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) : true)
                        .map(chat =>
                            <ChatListElement chat={chat} selected={chat.id === params.id}
                                             key={chat.id}/>
                        )}
                </div>
            </section>
            <Outlet/>
        </main>) :
        (<main css={mainCssMobile}>
                {params.id ?
                    <Outlet/> :
                    <section css={listContainerCssMobile}>
                        <ChatListFilter setFilter={setFilter}/>
                        <div css={listElementContainerCss}>
                            {data?.filter(chat => filter ? chat.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) : true)
                                .map(chat =>
                                    <ChatListElement chat={chat} selected={chat.id === params.id}
                                                     key={chat.id}/>
                                )}
                        </div>
                    </section>
                }
            </main>
        );
}

export default ChatList;

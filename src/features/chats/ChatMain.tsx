/** @jsxImportSource @emotion/react */

import React, {useEffect} from "react";
import {Outlet, useMatch, useParams} from "react-router-dom";
import useWebSocket from "react-use-websocket";
import useAuth from "../auth/AuthContext";
import {useQueryClient} from "react-query";
import {useChatList} from "./hooks";
import {Chat} from "../../entities/Chat";
import {listContainerCss, listContainerCssMobile, mainCss, mainCssMobile} from "./styles";
import ChatListFilter from "./list/ChatListFilter";
import {useMediaQuery} from "react-responsive";
import Nav from "../../components/Nav/Nav";
import {baseAppContainerWithoutTabsCss, baseAppContainerWithTabsCss} from "../../styles/layout";
import Tabs from "../../components/Nav/Tabs";
import ChatRoomHeader from "./room/ChatRoomHeader";
import ProfileInfoHeader from "../info/user/ProfileInfoHeader";
import ChatList from "./list/ChatList";
import {ChatMessageResponse} from "../../entities/ChatMessage";


function ChatMain() {

    const {token, user} = useAuth();
    const queryClient = useQueryClient();
    const params = useParams();

    const isUserProfile = useMatch("/chats/profile");
    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    const {data} = useChatList();

    const [filter, setFilter] = React.useState<string>("");


    const {
        lastJsonMessage
    } = useWebSocket(`${process.env.REACT_APP_WS_URL}/ws/chats/?${token}`, {
        onClose: () => console.error("Chat socket closed unexpectedly"),
        shouldReconnect: () => true,
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

            queryClient.setQueryData<ChatMessageResponse | undefined>(["chats", "messages", message.chat_id], (old) => {
                    if (old !== undefined) {
                        old.results.push(message);
                    }
                    return old;
                }
            );
        }
    }, [lastJsonMessage, queryClient]);


    return isDesktop ?
        // Desktop
        <div css={baseAppContainerWithoutTabsCss}>
            <Nav/>
            <main css={mainCss}>
                <section css={listContainerCss}>
                    <ChatListFilter setFilter={setFilter}/>
                    {data && user ?
                        <ChatList data={data} filter={filter} selectedId={params.id} userId={user?.id}/> :
                        null
                    }
                </section>
                <Outlet/>
            </main>
        </div> :

        // Mobile chat room
        params.id ?
            <div css={baseAppContainerWithoutTabsCss}>
                <ChatRoomHeader id={params.id}/>
                <main css={mainCssMobile}>
                    <Outlet/>
                </main>
            </div> :

            // User profile
            isUserProfile ?
                <div css={baseAppContainerWithoutTabsCss}>
                    <ProfileInfoHeader/>
                    <main css={mainCssMobile}>
                        <Outlet/>
                    </main>
                </div> :

                // Mobile chat list
                <div css={baseAppContainerWithTabsCss}>
                    <Nav/>
                    <main css={mainCssMobile}>
                        <section css={listContainerCssMobile}>
                            <ChatListFilter setFilter={setFilter}/>
                            {data && user ?
                                <ChatList data={data} filter={filter} selectedId={params.id} userId={user?.id}/> :
                                null
                            }
                        </section>
                    </main>
                    <Tabs/>
                </div>
        ;
}

export default ChatMain;

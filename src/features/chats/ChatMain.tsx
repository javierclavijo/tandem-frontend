/** @jsxImportSource @emotion/react */

import React, {useEffect} from "react";
import {Outlet, useParams} from "react-router-dom";
import useWebSocket from "react-use-websocket";
import useAuth from "../auth/AuthContext";
import {InfiniteData, useQueryClient} from "react-query";
import {Chat} from "../../entities/Chat";
import {mainCss, mainCssMobile} from "./styles";
import {useMediaQuery} from "react-responsive";
import Nav from "../../components/Nav";
import {baseAppContainerWithoutTabsCss, baseAppContainerWithTabsCss} from "../../styles/layout";
import Tabs from "../../components/Tabs";
import {ChatMessageResponse} from "../../entities/ChatMessage";
import ChatHeader, {ChatHeaderProps} from "../../components/ChatHeader";
import {chatRoomCss, chatRoomCssMobile} from "./room/styles";
import ChatList from "./ChatList";

function ChatMain() {

    const {token} = useAuth();
    const queryClient = useQueryClient();
    const params = useParams();

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    /**
     * State used by the router outlet context which controls the header's state. This way, the header's data can be
     * obtained from the view components, without them having to contain the header themselves.
     */
    const [header, setHeader] = React.useState<ChatHeaderProps | null>(null);

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

            queryClient.setQueryData<InfiniteData<ChatMessageResponse> | undefined>(
                ["chats", "messages", message.chat_id], (old) => {
                    if (old !== undefined) {
                        // Add the message to the first page, reassign the page in the array so that the
                        // bottom-scrolling effect hook is triggered.
                        const firstPage = {...old.pages[0]};
                        old.pages[0] = {...firstPage, results: [...firstPage.results, message]};
                    }
                    return old;
                }
            );
        }
    }, [lastJsonMessage, queryClient]);


    return isDesktop ?
        /**
         * Desktop
         */
        <div css={baseAppContainerWithoutTabsCss}>
            <Nav/>
            <main css={mainCss}>
                <ChatList/>
                <section css={isDesktop ? chatRoomCss : chatRoomCssMobile}>
                    {header ?
                        <ChatHeader {...header}/>
                        : null}
                    <Outlet context={[header, setHeader]}/>
                </section>
            </main>
        </div> :

        /**
         * Mobile chat room, user detail and channel detail views.
         */
        params.id ?
            <div css={baseAppContainerWithoutTabsCss}>
                {header ?
                    <ChatHeader {...header}/>
                    : null}
                <main css={mainCssMobile}>
                    <Outlet context={[header, setHeader]}/>
                </main>
            </div> :

            /**
             * Mobile chat list
             */
            <div css={baseAppContainerWithTabsCss}>
                <Nav/>
                <main css={mainCssMobile}>
                    <ChatList/>
                </main>
                <Tabs/>
            </div>;
}

export default ChatMain;

/** @jsxImportSource @emotion/react */

import React from "react";
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

    /**
     * Holds the WebSocket connection to the server.
     */
    const {
        lastJsonMessage
    } = useWebSocket(`${process.env.REACT_APP_WS_URL}/ws/chats/?${token}`, {
        onClose: () => console.error("Chat socket closed unexpectedly"),
        shouldReconnect: () => true,
        share: true
    });

    /**
     * Updates the chat list and the corresponding chat messages query whenever a message is received or sent.
     */
    React.useEffect(() => {
        if (!lastJsonMessage) {
            return;
        }

        const message = lastJsonMessage.message;
        if (message) {
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
         * Desktop layout. Displays the chat list to the left of the router's outlet.
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
         * Mobile layout. The grid layout and the elements displayed (nav, chat header and tabs) vary depending on the
         * current route.
         */
        <div css={params.id ? baseAppContainerWithoutTabsCss : baseAppContainerWithTabsCss}>
            {params.id && header ?
                <ChatHeader {...header}/> :
                <Nav/>}
            <main css={mainCssMobile}>
                <Outlet context={[header, setHeader]}/>
            </main>
            {!params.id ?
                <Tabs/> : null}
        </div>;
}

export default ChatMain;

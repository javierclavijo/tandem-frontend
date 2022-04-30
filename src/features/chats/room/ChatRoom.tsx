/** @jsxImportSource @emotion/react */

import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {messageSortFn, useChat, useSetChatHeader} from "../hooks";
import useAuth from "../../auth/AuthContext";
import {css} from "@emotion/react";
import ChatRoomMessage from "./ChatRoomMessage";
import ChatInputForm from "./ChatInputForm";
import {useMediaQuery} from "react-responsive";
import {chatRoomCss, chatRoomCssMobile} from "./styles";
import {ChatMessageResponse} from "../../../entities/ChatMessage";
import {useInView} from "react-intersection-observer";
import {InfiniteData} from "react-query";

function ChatRoom() {
    /**
     * Renders a chat's messages, plus the input form to send messages to the chat.
     */

    const params = useParams();
    const {user} = useAuth();
    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    /**
     * Ref for the message container div. Used to scroll to the bottom of the page when necessary.
     */
    const messageContainerRef = React.useRef<HTMLDivElement>(null);

    /**
     * Top div ref and intersection observer. Used to fetch more messages whenever the user scrolls to the top.
     */
    const {ref: topRef, inView: topInView} = useInView();
    const {ref: bottomRef, inView: bottomInView} = useInView();

    /**
     * Infinite query which fetches and holds the chat's messages.
     */
    const {data, chat, fetchNextPage, hasNextPage} = useChat(params.id as string, {
        staleTime: 15000,
        // Whenever query data changes, scroll to the bottom of the chat if it's positioned there to show new
        // messages, then sort messages.
        onSuccess: (data: InfiniteData<ChatMessageResponse>) => {
            data.pages.forEach(page =>
                page.results.sort((a, b) => messageSortFn(a, b)).reverse()
            );
            if (bottomInView) {
                scrollToBottom()
            }
            return data;
        },
    });

    /**
     * First messages page, used in the bottom-scrolling effect hook
     */
    const firstPage = data?.pages[0];

    /**
     * Set the chat header's data.
     */
    useSetChatHeader(chat);

    /**
     * Fetch the next page whenever the user scrolls to the top of the chat, if there are more pages.
     */
    useEffect(() => {
        if (topInView && hasNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, topInView]);


    /**
     * Function to scroll to the bottom of the chat.
     */
    const scrollToBottom = React.useCallback(() => {
        messageContainerRef.current?.scrollTo(0, messageContainerRef.current.scrollHeight);
    }, []);

    /**
     * Scrolls to the bottom of the chat whenever the first page of the chat is updated (when a message is received or
     * sent), but only if the user is at the bottom of the chat and the update is not due to fetching the next page.
     */
    React.useLayoutEffect(() => {
        scrollToBottom();
    }, [firstPage, scrollToBottom]);


    return chat && data ?
        <div css={isDesktop ? chatRoomCss : chatRoomCssMobile}>
            <div ref={messageContainerRef}
                 css={css`
                   overflow-y: scroll;
                   height: 100%;
                   display: flex;
                   flex-direction: column;
                 `}>
                {/* Top div, used to load more messages when visible. */}
                <div ref={topRef}/>
                {/* Clone the query's pages array and reverse it, as messages are in reverse timestamp order. */}
                {[...data?.pages].reverse().map((page, pageIndex) =>
                    <React.Fragment key={`page-${pageIndex}`}>
                        {page.results.map((message, messageIndex) => (
                            <ChatRoomMessage message={message}
                                             isOwnMessage={user?.id === message.author.id}
                                             type={chat?.type}
                                             key={message.id}
                                             ref={pageIndex === data?.pages.length - 1 &&
                                             messageIndex === page.results.length - 1 ? bottomRef : null}
                            />
                        ))}
                    </React.Fragment>
                )
                }
            </div>
            <ChatInputForm chat={chat}/>
        </div>
        : null;
}

export default ChatRoom;

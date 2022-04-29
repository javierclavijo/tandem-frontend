/** @jsxImportSource @emotion/react */

import React, {SyntheticEvent, useEffect} from "react";
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
    const params = useParams();
    const {user} = useAuth();
    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    const messageContainerRef = React.useRef<HTMLDivElement>(null);
    const [isScrollBottom, setIsScrollBottom] = React.useState<boolean>(true);

    /**
     * Top div ref and intersection observer
     */
    const {ref: topRef, inView: topInView} = useInView();

    useEffect(() => {
        if (topInView) {
            fetchNextPage();
        }
    }, [topInView]);

    const {data, chat, fetchNextPage, isSuccess} = useChat(params.id as string, {
        staleTime: 15000,
        // Whenever query data changes, scroll to the bottom of the chat if it's positioned there to show new
        // messages, then sort messages.
        onSuccess: (data: InfiniteData<ChatMessageResponse>) => {
            data.pages.forEach(page =>
                page.results.sort((a, b) => messageSortFn(a, b)).reverse()
            );
            data.pages.reverse();
            return data;
        },
    });

    useSetChatHeader(chat);

    const scrollToBottom = () => {
        if (isScrollBottom) {
            messageContainerRef.current?.scrollTo(0, messageContainerRef.current.scrollHeight);
        }
    };

    React.useEffect(scrollToBottom, [data, isScrollBottom]);

    const handleScroll = (event: SyntheticEvent) => {
        // On scroll, detect if the user has scrolled to bottom and set isScrollBottomRef.current accordingly. A number
        // of px are subtracted to have a bit of margin
        const element = event.target as HTMLDivElement;
        setIsScrollBottom(element.offsetHeight + element.scrollTop >= element.scrollHeight - 100);
    };

    React.useEffect(() => {
        // When another chat is selected, set the property to scroll to the bottom again
        setIsScrollBottom(true);
    }, [data]);

    return chat ?
        <div css={isDesktop ? chatRoomCss : chatRoomCssMobile}>
            <div ref={messageContainerRef}
                 onScroll={handleScroll}
                 css={css`
                   overflow-y: scroll;
                   height: 100%;
                   display: flex;
                   flex-direction: column;
                 `}>
                {/* Top div, used to load more messages when visible. */}
                <div ref={topRef}/>
                {data?.pages.map((page, index) =>
                    <React.Fragment key={`page-${index}`}>
                        {page.results.map((message, index) => (
                            <ChatRoomMessage message={message}
                                             isOwnMessage={user?.id === message.author.id}
                                             type={chat?.type}
                                             key={message.id}
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

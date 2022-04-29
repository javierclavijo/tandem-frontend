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
import {useInView} from "react-intersection-observer";

function ChatRoom() {
    const params = useParams();
    const {user} = useAuth();
    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    const messageContainerRef = React.useRef<HTMLDivElement>(null);
    const [isScrollBottom, setIsScrollBottom] = React.useState<boolean>(true);

    /**
     * Top div ref and intersection observer
     */
    const {ref:topRef, inView:topInView} = useInView()

    useEffect(()=> {
        if (topInView) {
            console.log('top in view');
        }
    })

    const {data, chat} = useChat(params.id as string, {
        staleTime: 15000,
        // Whenever query data changes, scroll to the bottom of the chat if it's positioned there to show new
        // messages, then sort messages.
        onSuccess: (data) => {
            scrollToBottom();
            return data?.results.sort((a, b) => messageSortFn(a, b)).reverse();
        },
    });

    useSetChatHeader(chat);

    const scrollToBottom = () => {
        if (isScrollBottom) {
            messageContainerRef.current?.scrollTo(0, messageContainerRef.current.scrollHeight);
        }
    };

    React.useEffect(scrollToBottom, [data?.results, isScrollBottom]);

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
                <div ref={topRef}/>
                {data?.results.map((message, index) => (
                    // Set the ref property for the top message to load more messages when it's visible.
                    <ChatRoomMessage message={message}
                                     isOwnMessage={user?.id === message.author.id}
                                     type={chat?.type}
                                     key={message.id}
                                     ref={index === 0 ? topRef : null}
                    />
                ))}
            </div>
            <ChatInputForm chat={chat}/>
        </div>
        : null;
}

export default ChatRoom;

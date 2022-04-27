/** @jsxImportSource @emotion/react */

import React, {SyntheticEvent} from "react";
import {useParams} from "react-router-dom";
import {messageSortFn, useChat} from "../hooks";
import {Chat} from "../../../entities/Chat";
import useAuth from "../../auth/AuthContext";
import {css} from "@emotion/react";
import ChatRoomMessage from "./ChatRoomMessage";
import ChatInputForm from "./ChatInputForm";
import {chatRoomCss, chatRoomCssMobile} from "./styles";
import {useMediaQuery} from "react-responsive";
import ChatRoomHeader from "./ChatRoomHeader";

function ChatRoom() {
    const params = useParams();
    const {user} = useAuth();

    const messageContainerRef = React.useRef<HTMLDivElement>(null);
    const [isScrollBottom, setIsScrollBottom] = React.useState<boolean>(true);

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    const {data} = useChat(params.id as string, {
        staleTime: 15000,
        // Whenever query data changes, scroll to the bottom of the chat if it's positioned there to show new
        // messages, then sort messages
        onSuccess: (data) => {
            scrollToBottom();
            return data.messages.sort((a, b) => messageSortFn(a, b)).reverse();
        },
    });

    const scrollToBottom = () => {
        if (isScrollBottom) {
            messageContainerRef.current?.scrollTo(0, messageContainerRef.current.scrollHeight);
        }
    };

    React.useEffect(scrollToBottom, [data?.messages, isScrollBottom]);

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

    return isDesktop ?
        <div css={chatRoomCss}>
            <ChatRoomHeader id={data?.id as string}/>
            <div ref={messageContainerRef}
                 onScroll={handleScroll}
                 css={css`
                   overflow-y: scroll;
                   height: 100%;
                   display: flex;
                   flex-direction: column;
                 `}>
                {data?.messages.map(message => (
                    <ChatRoomMessage message={message}
                                     isOwnMessage={user?.id === message.author.id}
                                     type={data.type}
                                     key={message.id}/>
                ))}
            </div>
            <ChatInputForm chat={data as Chat}/>
        </div> :
        <div css={chatRoomCssMobile}>
            <div ref={messageContainerRef}
                 onScroll={handleScroll}
                 css={css`
                   overflow-y: scroll;
                   height: 100%;
                   display: flex;
                   flex-direction: column;
                 `}>
                {data?.messages.map(message => (
                    <ChatRoomMessage message={message}
                                     isOwnMessage={user?.id === message.author.id}
                                     type={data.type}
                                     key={message.id}/>
                ))}
            </div>
            <ChatInputForm chat={data as Chat}/>
        </div>
        ;
}

export default ChatRoom;

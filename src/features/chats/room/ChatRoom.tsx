/** @jsxImportSource @emotion/react */

import React, {SyntheticEvent} from "react";
import {useOutletContext, useParams} from "react-router-dom";
import {getFriendFromFriendChat, messageSortFn, useChat} from "../hooks";
import useAuth from "../../auth/AuthContext";
import {css} from "@emotion/react";
import ChatRoomMessage from "./ChatRoomMessage";
import ChatInputForm from "./ChatInputForm";
import {useMediaQuery} from "react-responsive";
import {ChatHeaderProps} from "../ChatMain";
import {FriendChat} from "../../../entities/Chat";

function ChatRoom() {
    const params = useParams();
    const {user} = useAuth();

    const messageContainerRef = React.useRef<HTMLDivElement>(null);
    const [isScrollBottom, setIsScrollBottom] = React.useState<boolean>(true);

    const [header, setHeader] = useOutletContext<[ChatHeaderProps | null, React.Dispatch<React.SetStateAction<ChatHeaderProps | null>>]>();

    const {data, chat} = useChat(params.id as string, {
        staleTime: 15000,
        // Whenever query data changes, scroll to the bottom of the chat if it's positioned there to show new
        // messages, then sort messages.
        onSuccess: (data) => {
            scrollToBottom();
            return data?.results.sort((a, b) => messageSortFn(a, b)).reverse();
        },
    });

    /**
     * Set the header's data
     */
    React.useEffect(() => {
        if (chat) {
            let headerProps;
            if (chat.type === "users") {
                const friend = getFriendFromFriendChat(user!, chat as FriendChat);
                headerProps = {
                    link: `/chats/users/${friend?.id}`,
                    name: friend?.username,
                    image: friend?.image
                };
            } else {
                headerProps = {
                    link: `/chats/channels/${(chat.id)}`,
                    name: chat.name,
                    image: chat.image
                };
            }
            setHeader(headerProps);
        }
    }, [chat]);

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
        <React.Fragment>
            <div ref={messageContainerRef}
                 onScroll={handleScroll}
                 css={css`
                   overflow-y: scroll;
                   height: 100%;
                   display: flex;
                   flex-direction: column;
                 `}>
                {data?.results.map(message => (
                    <ChatRoomMessage message={message}
                                     isOwnMessage={user?.id === message.author.id}
                                     type={chat?.type}
                                     key={message.id}/>
                ))}
            </div>
            <ChatInputForm chat={chat}/>
        </React.Fragment>
        : null;
}

export default ChatRoom;

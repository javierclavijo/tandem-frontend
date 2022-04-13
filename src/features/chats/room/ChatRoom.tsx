/** @jsxImportSource @emotion/react */

import React, {SyntheticEvent, useState} from "react";
import {useParams} from "react-router-dom";
import {messageSortFn, useChatList} from "../hooks";
import {Chat} from "../../../entities/Chat";
import {useQuery} from "react-query";
import useAuth, {axiosApi} from "../../auth/AuthContext";
import {css} from "@emotion/react";
import ChatRoomMessage from "./ChatRoomMessage";
import ChatInputForm from "./ChatInputForm";
import {chatRoomCss, chatRoomHeaderCss} from "./styles";

function ChatRoom() {
    const params = useParams();

    const {user} = useAuth();
    const {data: chatList} = useChatList();
    const [chat, setChat] = useState<Chat>({} as Chat);

    const messageContainerRef = React.useRef<HTMLDivElement>(null);
    const [isScrollBottom, setIsScrollBottom] = React.useState<boolean>(true);

    const {data} = useQuery<Chat>(["chats", "detail", chat.id], async () => {
        const response = await axiosApi.get(chat.url);
        return response.data;
    }, {
        enabled: Boolean(chat.id),
        staleTime: 15000,
        // Whenever query data changes, scroll to the bottom of the chat if it's positioned there to show new
        // messages, then sort messages
        onSuccess: (data) => {
            scrollToBottom();
            return data.messages.sort((a, b) => messageSortFn(a, b)).reverse();
        },
    });

    React.useLayoutEffect(() => {
        // Fetch the resource's URL and ID from the chat list
        const chatResult = chatList?.find(c => c.id === params.id);
        if (chatResult) {
            setChat(chatResult);
        }
    }, [chatList, params.id]);

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
    }, [chat]);

    return (
        <div css={chatRoomCss}>
            <header css={chatRoomHeaderCss}>
                <h2>{chat.name}</h2>
            </header>
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
                                     chat_type={chat.chat_type}
                                     key={message.id}/>
                ))}
            </div>
            <ChatInputForm chat={chat}/>
        </div>
    );
}

export default ChatRoom;

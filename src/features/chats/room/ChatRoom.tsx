/** @jsxImportSource @emotion/react */

import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {messageSortFn, useChatList} from "../hooks";
import {Chat} from "../../../entities/Chat";
import {useQuery} from "react-query";
import useAuth, {axiosApi} from "../../auth/AuthContext";
import {css} from "@emotion/react";
import {colors} from "../../../styles/variables";
import ChatRoomMessage from "./ChatRoomMessage";
import ChatInputForm from "./ChatInputForm";

function ChatRoom() {
    const params = useParams();

    const {user} = useAuth();
    const {data: chatList} = useChatList();
    const [chat, setChat] = useState<Chat>({} as Chat);

    const {data} = useQuery<Chat>(["chats", "detail", chat.id], async () => {
        const response = await axiosApi.get(chat.url);
        return response.data;
    }, {
        enabled: Boolean(chat.id),
        staleTime: 15000,
        // Sort messages whenever query data changes
        onSuccess: (data) => data.messages.sort((a, b) => messageSortFn(a, b)).reverse(),
    });

    React.useEffect(() => {
        // Fetch the resource's URL and ID from the chat list
        const chatResult = chatList?.find(c => c.id === params.id);
        if (chatResult) {
            setChat(chatResult);
        }
    }, [chatList, params.id]);

    return (
        <div css={css`
          grid-area: room;
          background-color: ${colors.WHITE};
          border-radius: 3px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        `}>
            <header css={css`
              height: 4.15rem;
              background-color: ${colors.PRIMARY};
              display: flex;
              align-items: center;
              padding: 1rem;
              box-sizing: border-box;
              color: ${colors.WHITE};
            `}>
                <h2>{chat.name}</h2>
            </header>
            <div css={css`
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

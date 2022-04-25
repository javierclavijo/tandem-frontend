import React from "react";
import {listElementContainerCss} from "../styles";
import ChatListElement from "./ChatListElement";
import {Chat} from "../../../entities/Chat";

interface ChatListProps {
    data: Chat[];
    filter: string;
    userId: string;
    selectedId?: string;
}

function ChatList({data, filter, userId, selectedId}: ChatListProps) {
    return (
        <div css={listElementContainerCss}>
            {data?.filter(chat => filter ? chat.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) : true)
                .map(chat =>
                    <ChatListElement chat={chat}
                                     selected={chat.id === selectedId}
                                     latestMessageIsOwn={chat.messages[0].author.id === userId}
                                     key={chat.id}
                    />
                )}
        </div>
    );
}

export default ChatList;
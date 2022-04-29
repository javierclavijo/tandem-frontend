/** @jsxImportSource @emotion/react */

import React from "react";
import {listElementContainerCss} from "../styles";
import ChatListElement from "./ChatListElement";
import {Chat} from "../../../entities/Chat";
import {css} from "@emotion/react";

interface ChatListProps {
    data: Chat[];
    filter: string;
    userId: string;
    selectedId?: string;
}

function ChatList({data, filter, userId, selectedId}: ChatListProps) {
    /*
     * Chat list component, used in ChatMain. Allows filtering chats by name.
     */

    // Contains the filtered elements
    const [filteredElements, setFilteredElements] = React.useState<Chat[]>([]);

    React.useEffect(() => setFilteredElements(
        data?.filter(chat => filter ? chat.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) : true)
    ), [data, filter]);

    return (
        <div css={listElementContainerCss}>
            {filteredElements.map(chat =>
                <ChatListElement chat={chat}
                                 selected={chat.id === selectedId}
                                 latestMessageIsOwn={chat.messages[0].author.id === userId}
                                 key={chat.id}
                />
            )}
            {/* Empty list. Has different strings for cases where the user has chats and is filtering, and where the
            user doesn't have any chats. */}
            {!filteredElements.length ?
                <article css={css`
                  padding: 0 1rem 1rem 1rem;
                `}>
                    <p>
                        {data.length ?
                            "No chats match your query." :
                            "You don't have any chats yet."}
                    </p>
                </article> : null}
        </div>
    );
}

export default ChatList;

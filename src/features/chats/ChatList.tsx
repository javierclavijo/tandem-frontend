/** @jsxImportSource @emotion/react */

import React from "react";
import {listContainerCss, listContainerCssMobile} from "./styles";
import ChatListFilter from "./list/ChatListFilter";
import ChatListElements from "./list/ChatListElements";
import {Chat} from "../../entities/Chat";
import {User} from "../../entities/User";
import {useParams} from "react-router-dom";
import {useMediaQuery} from "react-responsive";

export interface ChatListProps {
    data: Chat[] | undefined;
    user: User | undefined;
}

function ChatList({data, user}: ChatListProps) {

    const params = useParams();
    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    const [filter, setFilter] = React.useState<string>("");

    return (
        <section css={isDesktop ? listContainerCss : listContainerCssMobile}>
            <ChatListFilter setFilter={setFilter}/>
            {data && user ?
                <ChatListElements data={data} filter={filter} selectedId={params.id} userId={user?.id}/> :
                null
            }
        </section>
    );
}

export default ChatList;
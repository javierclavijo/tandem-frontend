/** @jsxImportSource @emotion/react */

import React from "react";
import {listContainerCss, listContainerCssMobile} from "./styles";
import ChatListFilter from "./list/ChatListFilter";
import ChatListElements from "./list/ChatListElements";
import {useParams} from "react-router-dom";
import {useMediaQuery} from "react-responsive";
import {useChatList} from "./hooks";
import useAuth from "../auth/AuthContext";


function ChatList() {

    const params = useParams();
    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    const [filter, setFilter] = React.useState<string>("");

    const {data} = useChatList();
    const {user} = useAuth();

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
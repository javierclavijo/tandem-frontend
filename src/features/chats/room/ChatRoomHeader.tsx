/** @jsxImportSource @emotion/react */

import React from "react";
import {chatRoomHeaderCss} from "./styles";
import {Link} from "react-router-dom";
import {css} from "@emotion/react";
import {colors} from "../../../styles/variables";
import BackButton from "../../../components/BackButton/BackButton";
import {useMediaQuery} from "react-responsive";
import {useChat} from "../hooks";

function ChatRoomHeader({id}: { id: string }) {
    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});
    const {data} = useChat(id, {
        staleTime: 15000,
    });

    return (
        <header css={chatRoomHeaderCss}>
            {!isDesktop ?
                <BackButton to="/chats"/> :
                null
            }
            <h2><Link to={`/chats/${id}/info`} css={css`
              text-decoration: none;
              color: ${colors.WHITE};
            `}>
                {data?.name}
            </Link></h2>
        </header>
    );
}

export default ChatRoomHeader;

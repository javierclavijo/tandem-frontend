/** @jsxImportSource @emotion/react */

import React from "react";
import {Chat} from "../../../entities/Chat";
import {chatRoomHeaderCss} from "./styles";
import {Link} from "react-router-dom";
import {css} from "@emotion/react";
import {colors} from "../../../styles/variables";
import BackButton from "../../../components/BackButton/BackButton";
import {useMediaQuery} from "react-responsive";

function ChatRoomHeader({chat}: { chat: Chat }) {
    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    return (
        <header css={chatRoomHeaderCss}>
            {!isDesktop ?
                <BackButton to="/chats"/> :
                null
            }
            <h2><Link to={`info`} css={css`
              text-decoration: none;
              color: ${colors.WHITE};
            `}>
                {chat?.name}
            </Link></h2>
        </header>
    );
}

export default ChatRoomHeader;

/** @jsxImportSource @emotion/react */

import React from "react";
import {chatRoomHeaderCss} from "../features/chats/room/styles";
import BackButton from "./BackButton";
import {Link} from "react-router-dom";
import {css} from "@emotion/react";
import {colors} from "../styles/variables";
import {ChatHeaderProps} from "../features/chats/ChatMain";
import {useMediaQuery} from "react-responsive";


function ChatHeader(props: ChatHeaderProps) {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    return (
        <header css={chatRoomHeaderCss}>
            {!isDesktop ?
                <BackButton to="/chats"/> :
                null
            }
            <h2>{props.link ?
                <Link to={props.link} css={css`
                  text-decoration: none;
                  color: ${colors.WHITE};
                `}>
                    {props.title}
                </Link> :
                props.title
            }
            </h2>
        </header>
    );
}

export default ChatHeader;

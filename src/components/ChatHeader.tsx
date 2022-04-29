/** @jsxImportSource @emotion/react */

import React from "react";
import {chatRoomHeaderCss} from "../features/chats/room/styles";
import {Link} from "react-router-dom";
import {css} from "@emotion/react";
import {colors} from "../styles/variables";
import BackButton from "./BackButton";
import {useMediaQuery} from "react-responsive";
import {getFriendFromFriendChat, useChat} from "../features/chats/hooks";
import useAuth from "../features/auth/AuthContext";
import {FriendChat} from "../entities/Chat";

interface ChatHeaderProps {
    id: string;
}

function ChatHeader(props: ChatHeaderProps) {
    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});
    const {chat} = useChat(props.id, {
        staleTime: 15000,
    });
    const {user} = useAuth();

    return user ?
        <header css={chatRoomHeaderCss}>
            {!isDesktop ?
                <BackButton to="/chats"/> :
                null
            }
            <h2><Link to={
                chat?.type === "users" ?
                    `/chats/users/${getFriendFromFriendChat(user, chat as FriendChat)?.id}` :
                    `/chats/channels/${(props.id)}`
            } css={css`
              text-decoration: none;
              color: ${colors.WHITE};
            `}>
                {chat?.name}
            </Link></h2>
        </header> : null;
}

export default ChatHeader;

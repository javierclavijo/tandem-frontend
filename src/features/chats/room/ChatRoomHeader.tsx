/** @jsxImportSource @emotion/react */

import React from "react";
import {chatRoomHeaderCss} from "./styles";
import {Link} from "react-router-dom";
import {css} from "@emotion/react";
import {colors} from "../../../styles/variables";
import BackButton from "../../../components/BackButton";
import {useMediaQuery} from "react-responsive";
import {getFriendFromFriendChat, useChat} from "../hooks";
import useAuth from "../../auth/AuthContext";
import {FriendChat} from "../../../entities/Chat";

function ChatRoomHeader({id}: { id: string }) {
    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});
    const {chat} = useChat(id, {
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
                    `/chats/channels/${id}`
            } css={css`
              text-decoration: none;
              color: ${colors.WHITE};
            `}>
                {chat?.name}
            </Link></h2>
        </header> : null;
}

export default ChatRoomHeader;

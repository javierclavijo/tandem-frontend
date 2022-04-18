/** @jsxImportSource @emotion/react */

import React from "react";
import {Chat} from "../../../entities/Chat";
import {useQuery} from "react-query";
import {Channel} from "../../../entities/Channel";
import {axiosApi} from "../../auth/AuthContext";
import {chatRoomCss, chatRoomCssMobile} from "../../chats/room/styles";
import ChatRoomHeader from "../../chats/room/ChatRoomHeader";
import {useMediaQuery} from "react-responsive";

function UserInfo({chat}: { chat: Chat }) {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    const {data} = useQuery<Channel>(["chats", "info", chat.id], async () => {
        const response = await axiosApi.get(chat.info_url);
        return response.data;
    }, {
        staleTime: 15000,
    });

    return isDesktop ?
        <div css={chatRoomCss}>
            <ChatRoomHeader id={chat.id}/>
            <p>{data?.description}</p>
        </div> :
        <div css={chatRoomCssMobile}>
            <p>{data?.description}</p>
        </div>
        ;
}

export default UserInfo;

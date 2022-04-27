import React from "react";
import {OtherUserInfo} from "./user/UserInfo";
import ChannelInfo from "./channel/ChannelInfo";
import {useChat} from "../chats/hooks";
import {useParams} from "react-router-dom";

function ChatInfo() {
    const params = useParams();
    const {chat} = useChat(params.id as string, undefined);

    return chat?.type === "users" ?
        <OtherUserInfo id={chat?.id} url={chat?.infoUrl}/> :
        chat?.type === "channels" ?
            <ChannelInfo chat={chat}/> :
            null
        ;
}

export default ChatInfo;

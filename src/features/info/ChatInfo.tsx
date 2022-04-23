import React from "react";
import UserInfo from "./user/UserInfo";
import ChannelInfo from "./channel/ChannelInfo";
import {useChat} from "../chats/hooks";
import {useParams} from "react-router-dom";

function ChatInfo() {
    const params = useParams();
    const {data} = useChat(params.id as string, undefined);

    return data?.chat_type === "user" ?
        <UserInfo id={data?.id} url={data?.info_url}/> :
        data?.chat_type === "channel" ?
            <ChannelInfo chat={data}/> :
            null
        ;
}

export default ChatInfo;

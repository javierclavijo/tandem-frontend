import React from "react";
import {OtherUserInfo} from "./user/UserInfo";
import ChannelInfo from "./channel/ChannelInfo";
import {useChat} from "../chats/hooks";
import {useParams} from "react-router-dom";

function ChatInfo() {
    const params = useParams();
    const {data} = useChat(params.id as string, undefined);

    return data?.type === "users" ?
        <OtherUserInfo id={data?.id} url={data?.info_url}/> :
        data?.type === "channels" ?
            <ChannelInfo chat={data}/> :
            null
        ;
}

export default ChatInfo;

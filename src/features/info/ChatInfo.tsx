import React from "react";
import UserInfo from "./user/UserInfo";
import ChannelInfo from "./channel/ChannelInfo";
import {useChat} from "../chats/hooks";
import {useParams} from "react-router-dom";
import {Chat} from "../../entities/Chat";

function ChatInfo() {
    const params = useParams();
    const {data} = useChat(params.id as string, undefined);

    return data?.chat_type === "user" ?
        <UserInfo chat={data as Chat}/> :
        <ChannelInfo chat={data as Chat}/>
        ;
}

export default ChatInfo;

import React, {useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {selectToken} from "../app/authSlice";
import {useFetchChannelChatListQuery} from "../app/services/api";


function ChatList() {

    const token = useAppSelector(selectToken);
    const {data: channelChatData} = useFetchChannelChatListQuery();

    return (
        <div>
            <ul>
                {channelChatData?.results.map(chat => (
                    <li>{chat.url}</li>
                ))}
            </ul>
        </div>
    );
}

export default ChatList;

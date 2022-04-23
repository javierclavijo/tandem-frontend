/** @jsxImportSource @emotion/react */

import React, {useState} from "react";
import {useQuery} from "react-query";
import {Channel} from "../../../entities/Channel";
import useAuth, {axiosApi} from "../../auth/AuthContext";
import {chatRoomCss, chatRoomCssMobile} from "../../chats/room/styles";
import ChatRoomHeader from "../../chats/room/ChatRoomHeader";
import {useMediaQuery} from "react-responsive";

interface UserInfoProps {
    id: string;
    url: string;
}

function UserInfo({id,url}: UserInfoProps) {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    const {user} = useAuth();
    const {data} = useQuery<Channel>(["chats", "info", id], async () => {
        const response = await axiosApi.get(url);
        return response.data;
    }, {
        staleTime: 15000,
    });

    const [editable, setEditable] = useState<boolean>(false);

    React.useEffect(() => setEditable(
        // Check if the user has admin role, set the 'editable' state accordingly
        !!data?.memberships.some(membership =>
            membership.user?.id === user?.id && membership.role === "Administrator"
        )), [data?.memberships, user]);


    return isDesktop ?
        <div css={chatRoomCss}>
            <ChatRoomHeader id={id}/>
            <p>{data?.description}</p>
        </div> :
        <div css={chatRoomCssMobile}>
            <p>{data?.description}</p>
        </div>
        ;
}

export default UserInfo;

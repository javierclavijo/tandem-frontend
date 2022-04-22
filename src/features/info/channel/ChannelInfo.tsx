/** @jsxImportSource @emotion/react */

import React, {useState} from "react";
import {Chat} from "../../../entities/Chat";
import {chatRoomCss, chatRoomCssMobile} from "../../chats/room/styles";
import ChatRoomHeader from "../../chats/room/ChatRoomHeader";
import {useMediaQuery} from "react-responsive";
import {useQuery} from "react-query";
import {Channel} from "../../../entities/Channel";
import useAuth, {axiosApi} from "../../auth/AuthContext";
import {css} from "@emotion/react";
import DescriptionTextarea from "../DescriptionTextarea";
import {descriptionSection, infoSection, languageItem, languageSection, membersSection, profileImg} from "./styles";
import ChannelMemberListElement from "./ChannelMemberListElement";

const placeholderImg = require("../../../static/images/user_placeholder.png");


function ChannelInfo({chat}: { chat: Chat }) {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});
    const {user} = useAuth();
    const {data} = useQuery<Channel>(["chats", "info", chat.id], async () => {
        const response = await axiosApi.get(chat.info_url);
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


    return (
        <div css={css`${isDesktop ? chatRoomCss : chatRoomCssMobile};
          overflow-y: scroll;
        `}>
            {isDesktop ?
                <ChatRoomHeader id={data?.id as string}/> :
                null}
            <section css={infoSection}>
                <img src={placeholderImg} alt="" css={profileImg}/>
                <p>{data?.name}</p>
                <p>Channel · {data?.memberships.length} members</p>
                <section css={descriptionSection}>
                    {editable ?
                        <DescriptionTextarea channelData={data}/> :
                        <React.Fragment>
                            <h3>Description</h3>
                            <p>{data?.description}</p>
                        </React.Fragment>
                    }
                </section>
                <section css={languageSection}>
                    <div css={languageItem}>
                        <h3>Language</h3>
                        <p>{data?.language}</p>
                    </div>
                    <div css={languageItem}>
                        <h3>Level</h3>
                        <p>{data?.level}</p>
                    </div>
                </section>
            </section>
            <section css={membersSection}>
                <h3>Members</h3>
                {data?.memberships.map(membership =>
                    <ChannelMemberListElement membership={membership} key={membership.url}/>
                )}
            </section>
        </div>
    );
}

export default ChannelInfo;

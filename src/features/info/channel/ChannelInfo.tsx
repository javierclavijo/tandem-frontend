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
import DescriptionTextarea from "../components/DescriptionTextarea";
import {descriptionSection, infoSection, listSection, profileImg} from "../styles";
import InfoListElement from "./InfoListElement";
import {ChannelNameInput} from "../components/NameInput";
import LanguageBadge from "../../../components/LanguageBadge/LanguageBadge";
import {colors} from "../../../styles/variables";
import ChannelEditLanguageBadge from "./ChannelEditLanguageBadge";

const defaultImg = require("../../../static/images/user_placeholder.png");


function ChannelInfo({chat}: { chat: Chat }) {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});
    const {user} = useAuth();
    const {data} = useQuery<Channel>(["chats", "info", chat.id], async () => {
        const response = await axiosApi.get(chat.infoUrl);
        return response.data;
    }, {
        staleTime: 15000,
    });


    const [editable, setEditable] = useState<boolean>(false);

    React.useEffect(() => setEditable(
        // Check if the user has admin role, set the 'editable' state accordingly
        !!data?.memberships.some(membership =>
            membership.user?.id === user?.id && membership.role === "A"
        )), [data?.memberships, user]);


    return data ?
        <div css={css`${isDesktop ? chatRoomCss : chatRoomCssMobile};
          overflow-y: scroll;
        `}>
            {isDesktop ?
                <ChatRoomHeader id={data?.id as string}/> :
                null}
            <section css={infoSection}>
                <img src={data.image ?? defaultImg} alt="" css={profileImg}/>
                {editable && data ?
                    <ChannelNameInput data={data}/> :
                    <p>{data?.name}</p>
                }
                <p>Channel · {data?.memberships.length} members</p>
                {editable ?
                    <ChannelEditLanguageBadge data={data} bg={colors.DARK}/> :
                    <LanguageBadge language={data.language} level={data.level} bg={colors.DARK}/>
                }
                <section css={descriptionSection}>
                    {editable && data ?
                        <DescriptionTextarea data={data}/> :
                        <React.Fragment>
                            <h3>Description</h3>
                            <p>{data?.description}</p>
                        </React.Fragment>
                    }
                </section>
            </section>
            <section css={listSection}>
                <h3>Members</h3>
                {data?.memberships.map(membership =>
                    membership.user ?
                        <InfoListElement name={membership.user?.username}
                                         additionalInfo={membership.role === "A" ? "Admin" : undefined}
                                         description={membership.user.description}
                                         key={membership.url}
                                         image={membership.user.image}
                        />
                        : null
                )}
            </section>
        </div> :
        null
        ;
}

export default ChannelInfo;

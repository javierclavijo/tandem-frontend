/** @jsxImportSource @emotion/react */

import React from "react";
import {Chat} from "../../../entities/Chat";
import {chatRoomCss, chatRoomCssMobile} from "../../chats/room/styles";
import ChatRoomHeader from "../../chats/room/ChatRoomHeader";
import {useMediaQuery} from "react-responsive";
import {useQuery} from "react-query";
import {Channel} from "../../../entities/Channel";
import useAuth, {axiosApi} from "../../auth/AuthContext";
import {css} from "@emotion/react";
import {colors} from "../../../styles/variables";
import {NavArrowDown} from "iconoir-react";
import Description from "../Description";
import {
    descriptionSection,
    infoSection,
    languageItem,
    languageSection,
    memberArticle,
    memberImg,
    membersSection,
    profileImg
} from "./styles";

const placeholderImg = require("../../../static/images/user_placeholder.png");


function ChannelInfo({chat}: { chat: Chat }) {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});
    const {user} = useAuth();
    const editableRef = React.useRef<boolean>(false);

    const {data} = useQuery<Channel>(["chats", "info", chat.id], async () => {
        const response = await axiosApi.get(chat.info_url);
        return response.data;
    }, {
        staleTime: 15000,
    });

    React.useEffect(() => {
        editableRef.current = !!data?.memberships.some(membership =>
            membership.user?.id === user?.id && membership.role === "Administrator"
        );
    }, [data?.memberships, user]);


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
                        <Description data={data} editable={editableRef.current}/>
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
                    <article css={memberArticle}>
                        <img src={placeholderImg} alt="" css={memberImg}/>
                        <div css={css`
                          display: flex;
                          flex-direction: column;
                          justify-content: space-between;
                          width: 100%;
                        `}>
                            <div css={css`
                              display: flex;
                              flex-direction: row;
                              justify-content: space-between;
                              align-items: center;
                              height: 100%;
                            `}>
                                <h4>{membership.user?.username}</h4>
                                <NavArrowDown color={colors.PRIMARY} width={"1.5rem"} height={"1.5rem"}/>
                            </div>
                            <div css={css`
                              height: 100%;
                              display: flex;
                              align-items: center;
                            `}>
                                <p css={css`
                                  text-overflow: ellipsis;
                                  overflow: hidden;
                                  white-space: nowrap;
                                  max-width: 14rem;
                                `}>
                                    {membership.user?.description}
                                </p>
                            </div>
                        </div>
                    </article>
                )}
            </section>
        </div>
    );
}

export default ChannelInfo;

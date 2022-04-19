/** @jsxImportSource @emotion/react */

import React from "react";
import {Chat} from "../../../entities/Chat";
import {chatRoomCss, chatRoomCssMobile} from "../../chats/room/styles";
import ChatRoomHeader from "../../chats/room/ChatRoomHeader";
import {useMediaQuery} from "react-responsive";
import {useQuery} from "react-query";
import {Channel} from "../../../entities/Channel";
import {axiosApi} from "../../auth/AuthContext";
import {css} from "@emotion/react";
import {colors} from "../../../styles/variables";
import {NavArrowDown} from "iconoir-react";

const placeholderImg = require("../../../static/images/user_placeholder.png");

function ChannelInfo({chat}: { chat: Chat }) {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    const {data} = useQuery<Channel>(["chats", "info", chat.id], async () => {
        const response = await axiosApi.get(chat.info_url);
        return response.data;
    }, {
        staleTime: 15000,
    });

    const infoSection = css`
      background-color: ${colors.PRIMARY};
      color: ${colors.WHITE};
      padding: 1rem;
      box-sizing: border-box;

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    `;

    const profileImg = css`
      width: 50%;
      border-radius: 50%;
    `;

    const descriptionSection = css`
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    `;

    const languageSection = css`
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    `;

    const languageItem = css`
      width: 100%;
      display: flex;
      justify-content: space-between;
    `;

    const membersSection = css`
      padding: 1rem;
      background-color: ${colors.WHITE};
      color: ${colors.DARK};

      display: flex;
      flex-direction: column;
      gap: 1rem;
    `;

    const memberArticle = css`
      width: 100%;
      display: flex;
      gap: 1rem;
    `;

    const memberImg = css`
      width: 3rem;
      border-radius: 50%;
    `;

    return isDesktop ?
        <div css={css`${chatRoomCss};
        `}>
            <ChatRoomHeader id={chat.id}/>
            <div css={infoSection}>
                <p>{data?.description}</p>
            </div>
        </div> :
        <div css={css`${chatRoomCssMobile};
          overflow-y: scroll;
        `}>
            <section css={infoSection}>
                <img src={placeholderImg} alt="" css={profileImg}/>
                <p>Channel · {data?.memberships.length} members</p>
                <section css={descriptionSection}>
                    <h3>Description</h3>
                    <p>{data?.description}</p>
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
                            <p css={css`
                              text-overflow: ellipsis;
                              overflow: hidden;
                              white-space: nowrap;
                              max-width: 14rem;
                              height: 100%;
                              display: flex;
                              align-items: center;
                            `}>
                                {membership.user?.description}
                            </p>
                        </div>
                    </article>
                )}
            </section>
        </div>
        ;
}

export default ChannelInfo;

/** @jsxImportSource @emotion/react */

import React from "react";
import {useQuery} from "react-query";
import useAuth, {axiosApi} from "../../auth/AuthContext";
import {chatRoomCss, chatRoomCssMobile} from "../../chats/room/styles";
import ChatRoomHeader from "../../chats/room/ChatRoomHeader";
import {useMediaQuery} from "react-responsive";
import {User} from "../../../entities/User";
import {useMatch} from "react-router-dom";
import ProfileInfoHeader from "./ProfileInfoHeader";
import {css} from "@emotion/react";
import {descriptionSection, infoSection, languageSection, membersSection, profileImg} from "../channel/styles";
import {UserNameInput} from "../components/NameInput";

const placeholderImg = require("../../../static/images/user_placeholder.png");


function UserInfo({data, editable}: { data: User, editable: boolean }) {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});
    const isUserProfile = useMatch("/chats/profile");

    return (
        <div css={css`${isDesktop ? chatRoomCss : chatRoomCssMobile};
          overflow-y: scroll;
        `}>
            {isDesktop ?
                isUserProfile ?
                    <ProfileInfoHeader/> :
                    <ChatRoomHeader id={data.id}/> :
                null
            }
            <section css={infoSection}>
                <img src={placeholderImg} alt="" css={profileImg}/>
                {editable && data ?
                    <UserNameInput data={data}/> :
                    <p>{data?.username}</p>
                }
                <section css={descriptionSection}>
                    {editable ? null :
                        // <DescriptionTextarea data={data}/> :
                        <React.Fragment>
                            <h3>Description</h3>
                            <p>{data?.description}</p>
                        </React.Fragment>
                    }
                </section>
                <section css={languageSection}>
                    {/*<div css={languageItem}>*/}
                    {/*    <h3>Language</h3>*/}
                    {/*    <p>{data?.language}</p>*/}
                    {/*</div>*/}
                    {/*<div css={languageItem}>*/}
                    {/*    <h3>Level</h3>*/}
                    {/*    <p>{data?.level}</p>*/}
                    {/*</div>*/}
                </section>
            </section>
            <section css={membersSection}>
                <h3>Friends</h3>
                {/*{data?.memberships.map(membership =>*/}
                {/*    <ChannelMemberListElement membership={membership} key={membership.url}/>*/}
                {/*)}*/}
            </section>
        </div>
    );
}

export function OwnUserInfo() {

    const {user} = useAuth();

    return user ? <UserInfo data={user} editable={true}/> : null;
}

export function OtherUserInfo({id, url}: { id: string, url: string }) {

    const {data} = useQuery<User>(["chats", "info", id], async () => {
        const response = await axiosApi.get(url);
        return response.data;
    }, {
        staleTime: 15000,
    });

    return data ? <UserInfo data={data} editable={false}/> : null;
}

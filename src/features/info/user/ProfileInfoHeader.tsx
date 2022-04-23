/** @jsxImportSource @emotion/react */

import React from "react";
import {chatRoomHeaderCss} from "../../chats/room/styles";
import BackButton from "../../../components/BackButton/BackButton";
import {useMediaQuery} from "react-responsive";

function ProfileInfoHeader() {
    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    return (
        <header css={chatRoomHeaderCss}>
            {!isDesktop ?
                <BackButton/> :
                null
            }
            <h2>Your profile</h2>
        </header>
    );
}

export default ProfileInfoHeader;
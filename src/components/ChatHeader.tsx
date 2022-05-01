/** @jsxImportSource @emotion/react */

import React from "react";
import {chatRoomHeaderCss} from "../features/chats/room/styles";
import BackButton from "./BackButton";
import {Link, To} from "react-router-dom";
import {css} from "@emotion/react";
import {useMediaQuery} from "react-responsive";

const defaultImg = require("../static/images/user_placeholder.png");


export interface ChatHeaderProps {
    title?: string;
    link?: To;
    image?: string | null;
    actions?: JSX.Element;
}

function ChatHeader(props: ChatHeaderProps) {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    return (
        <header css={chatRoomHeaderCss}>
            <div css={css`
              display: flex;
              align-items: center;
              gap: 0.5rem;
            `}>
                {!isDesktop ?
                    <BackButton to="/chats"/> :
                    null
                }
                <div css={css`
                  display: grid;
                  grid-template-rows: 1fr;
                  grid-template-columns: 1fr;
                  grid-template-areas: "element";
                `}>
                    <div css={css`
                      grid-area: element;
                      display: flex;
                      align-items: center;
                      gap: 1rem;
                    `}>
                        {props.image || props.image === null ?
                            <div css={imageContainer}>
                                <img src={props.image ?? defaultImg} alt=""
                                     css={userImage}
                                />
                            </div> : null}
                        <h2>{props.title}</h2>
                    </div>
                    {props.link ?
                        <Link to={props.link} css={css`
                          grid-area: element;
                          z-index: 10;
                          width: auto;
                          height: auto;
                        `}/> : null}
                </div>
            </div>
            {props.actions}
        </header>
    );
}

const userImage = css`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const imageContainer = css`
  height: 3rem;
  width: 3rem;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 0 auto;
`;


export default ChatHeader;

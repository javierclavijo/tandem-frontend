/** @jsxImportSource @emotion/react */

import React from "react";
import { chatHeader } from "../features/chats/room/styles";
import BackButton from "./BackButton";
import { Link, To } from "react-router-dom";
import { css } from "@emotion/react";
import {
  containerWithLink,
  thumbnailContainer,
  thumbnailImg,
} from "../styles/components";

const defaultImg = require("../static/images/user_placeholder.png");

export interface ChatHeaderProps {
  title?: string;
  link?: To;
  image?: string | null;
  actions?: JSX.Element;
}

function ChatHeader(props: ChatHeaderProps) {
  return (
    <header css={chatHeader}>
      <div css={backButtonContainer}>
        <BackButton />
        <div css={containerWithLink}>
          <div css={innerContainer}>
            {props.image || props.image === null ? (
              <div css={imageContainer}>
                <img
                  src={props.image ?? defaultImg}
                  alt=""
                  css={thumbnailImg}
                />
              </div>
            ) : null}
            <h2>{props.title}</h2>
          </div>
          {props.link ? <Link to={props.link} css={link} /> : null}
        </div>
      </div>
      {props.actions}
    </header>
  );
}

const imageContainer = css`
  ${thumbnailContainer};
  flex: 0 0 auto;
`;

const backButtonContainer = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const innerContainer = css`
  grid-area: element;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const link = css`
  grid-area: element;
  z-index: 10;
  width: auto;
  height: auto;
`;

export default ChatHeader;

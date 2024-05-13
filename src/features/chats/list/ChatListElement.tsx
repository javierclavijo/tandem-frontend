/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { DateTime } from "luxon";
import React from "react";
import { NavLink } from "react-router-dom";
import defaultImg from "../../../static/images/user_placeholder.png";
import { thumbnailContainer, thumbnailImg } from "../../../styles/components";
import { colors, textSizes } from "../../../styles/variables";
import ResponsiveEllipsis from "../../../utils/ResponsiveEllipsis";
import { Chat } from "../../common/types";
import { elementContentContainer, link } from "../styles";

interface ChatListElementProps {
  chat: Chat;
  selected: boolean;
  latestMessageIsOwn: boolean;
}

/**
 * Chat list element component. Renders with a different background color based on whether the
 * element's chat is currently being displayed, or the user is hovering the mouse above the element.
 */
function ChatListElement({
  chat,
  selected,
  latestMessageIsOwn,
}: ChatListElementProps) {
  const chatListElementContainer = css`
    display: grid;
    border-bottom: 1px solid ${colors.LIGHT};
    color: ${selected ? colors.WHITE : colors.DARK};
    width: 100%;
    background-color: ${selected ? colors.PRIMARY : colors.WHITE};
    padding: 0 1rem;
    box-sizing: border-box;
    transition: background-color 0.1s;

    &:hover {
      ${!selected ? `background-color: ${colors.LIGHT};` : ""}
    }
  `;

  return (
    <li css={chatListElementContainer}>
      <div css={elementContentContainer}>
        <div css={thumbnailContainer}>
          <img src={chat.image ?? defaultImg} alt="" css={thumbnailImg} />
        </div>
        <div css={innerContainer}>
          <span css={title}>
            <span>{chat.name}</span>
            <span css={latestMessageDatetime}>
              {/* If the chat has messages, show the date when the latest message was sent. */}
              {chat.messages.length
                ? DateTime.fromISO(chat.messages[0].timestamp).toLocaleString(
                    DateTime.DATE_SHORT,
                  )
                : null}
            </span>
          </span>
          {/* If there's messages in the chat, show the first message and its author's username, or 'You'
              if the current user is the author. */}
          <ResponsiveEllipsis
            text={
              chat.messages.length
                ? latestMessageIsOwn
                  ? `You: ${chat.messages[0].content}`
                  : `${chat.messages[0].author.username}: ${chat.messages[0].content}`
                : ""
            }
            maxLine="1"
            ellipsis="…"
            trimRight
            basedOn="letters"
            css={content}
          />
        </div>
      </div>
      <NavLink to={`/chats/${chat.id}`} css={link} title={chat.name}>
        <></>
      </NavLink>
    </li>
  );
}

const innerContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const title = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const latestMessageDatetime = css`
  font-size: ${textSizes.S};
`;

const content = css`
  overflow-wrap: anywhere;
`;

export default ChatListElement;

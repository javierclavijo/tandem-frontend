/** @jsxImportSource @emotion/react */

import React from "react";
import { Chat } from "../../../entities/Chat";
import { Link } from "react-router-dom";
import { css } from "@emotion/react";
import { DateTime } from "luxon";
import { colors, textSizes } from "../../../styles/variables";
import { elementContentContainer, link } from "../styles";
import { thumbnailContainer, thumbnailImg } from "../../../styles/components";

const defaultImg = require("../../../static/images/user_placeholder.png");

interface ChatListElementProps {
  chat: Chat;
  selected: boolean;
  latestMessageIsOwn: boolean;
}

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

    &:hover {
      ${!selected ? `background-color: ${colors.LIGHT};` : ""}
    }
  `;

  return (
    <article css={chatListElementContainer}>
      <div css={elementContentContainer}>
        <div css={thumbnailContainer}>
          <img src={chat.image ?? defaultImg} alt="" css={thumbnailImg} />
        </div>
        <div css={innerContainer}>
          <span css={title}>
            <span>{chat.name}</span>
            <span
              css={css`
                font-size: ${textSizes.S};
              `}
            >
              {/* If the chat has messages, show the date when the latest message was sent. */}
              {chat.messages.length
                ? DateTime.fromISO(chat.messages[0].timestamp).toLocaleString(
                    DateTime.DATE_SHORT
                  )
                : null}
            </span>
          </span>
          <span css={description}>
            {/* If there's messages in the chat, show the first message and its author's username, or 'You'
                        if the current user is the author. */}
            {chat.messages.length
              ? latestMessageIsOwn
                ? `You: ${chat.messages[0].content}`
                : `${chat.messages[0].author.username}: ${chat.messages[0].content}`
              : null}
          </span>
        </div>
      </div>
      <Link to={`/chats/${chat.id}`} css={link} />
    </article>
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

const description = css`
  font-size: ${textSizes.S};
  max-width: 13rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export default ChatListElement;

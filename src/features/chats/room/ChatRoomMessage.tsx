/** @jsxImportSource @emotion/react */

import React from "react";
import { ChatMessage } from "../../../entities/ChatMessage";
import { css } from "@emotion/react";
import { colors, textSizes } from "../../../styles/variables";
import { DateTime } from "luxon";

interface ChatRoomMessageProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  type: "users" | "channels";
}

function ChatRoomMessage(
  { message, isOwnMessage, type }: ChatRoomMessageProps,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <div
      css={isOwnMessage ? ownMessageOuterContainer : outerContainer}
      ref={ref}
    >
      {!isOwnMessage ? <div css={speechBubbleOtherMessage} /> : null}
      <div css={isOwnMessage ? ownMessage : otherMessage}>
        {!isOwnMessage && type === "channels" ? (
          <span css={username}>{message.author.username}</span>
        ) : null}
        <span css={content}>{message.content}</span>
        <span css={datetime}>
          {DateTime.fromISO(message.timestamp).toLocaleString(
            DateTime.DATETIME_SHORT
          )}
        </span>
      </div>
      {isOwnMessage ? <div css={speechBubbleOwnMessage} /> : null}
    </div>
  );
}

const outerContainer = css`
  display: flex;
  margin: 0.25rem 0.5rem;
`;

const ownMessageOuterContainer = css`
  ${outerContainer};
  justify-content: flex-end;
`;

const innerContainer = css`
  max-width: calc(5 / 8 * 100%);
  min-width: 10rem;
  width: fit-content;
  padding: 0.5rem;
  box-sizing: border-box;
  color: ${colors.WHITE};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ownMessage = css`
  ${innerContainer};
  align-self: flex-end;
  background-color: ${colors.PRIMARY};
  border-radius: 5px 0 5px 5px;
`;

const otherMessage = css`
  ${innerContainer};
  background-color: ${colors.DARK};
  border-radius: 0 5px 5px 5px;
`;

const speechBubbleOwnMessage = css`
  clip-path: polygon(100% 0, 0 0, 0 100%);
  background-color: ${colors.PRIMARY};
  width: 0.5rem;
  height: 1rem;
`;

const speechBubbleOtherMessage = css`
  clip-path: polygon(100% 0, 0 0, 100% 100%);
  background-color: ${colors.DARK};
  width: 0.5rem;
  height: 1rem;
`;

const username = css`
  font-size: ${textSizes.S};
  width: fit-content;
`;

const datetime = css`
  font-size: ${textSizes.S};
  align-self: flex-end;
`;

const content = css`
  font-size: ${textSizes.M};
`;

export default React.forwardRef(ChatRoomMessage);

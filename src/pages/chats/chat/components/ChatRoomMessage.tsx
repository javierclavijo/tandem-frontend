import { css } from "@emotion/react";
import { DateTime } from "luxon";
import React from "react";
import { COLORS, FONT_SIZES } from "../../../../common/constants";
import { ChatType } from "../../types";

interface ChatRoomMessageProps {
  authorName: string;
  content: string;
  timestamp: string;
  isOwnMessage: boolean;
  chatType: ChatType;
}

/**
 * Chat message component. Renders with different styles depending on whether the message was
 * sent by the session's user or another user. If the chat is of channel type, renders the
 * message's author's name above the message's contents.
 */
const ChatRoomMessage = (
  {
    authorName,
    content,
    timestamp,
    isOwnMessage,
    chatType: type,
  }: ChatRoomMessageProps,
  ref: React.Ref<HTMLDivElement>,
) => {
  const formattedDateTime = DateTime.fromISO(timestamp).toLocaleString(
    DateTime.DATETIME_SHORT,
  );

  return (
    <div
      css={isOwnMessage ? ownMessageOuterContainer : outerContainer}
      ref={ref}
    >
      {!isOwnMessage ? <div css={speechBubbleOtherMessage} /> : null}
      <div css={isOwnMessage ? ownMessage : otherMessage}>
        {!isOwnMessage && type === "channels" ? (
          <span css={username}>{authorName}</span>
        ) : null}
        <span css={contentCss}>{content}</span>
        <span css={datetime}>{formattedDateTime}</span>
      </div>
      {isOwnMessage ? <div css={speechBubbleOwnMessage} /> : null}
    </div>
  );
};

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
  color: ${COLORS.WHITE};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ownMessage = css`
  ${innerContainer};
  align-self: flex-end;
  background-color: ${COLORS.PRIMARY};
  border-radius: 5px 0 5px 5px;
`;

const otherMessage = css`
  ${innerContainer};
  background-color: ${COLORS.DARK};
  border-radius: 0 5px 5px 5px;
`;

const speechBubbleOwnMessage = css`
  clip-path: polygon(100% 0, 0 0, 0 100%);
  background-color: ${COLORS.PRIMARY};
  width: 0.5rem;
  height: 1rem;
`;

const speechBubbleOtherMessage = css`
  clip-path: polygon(100% 0, 0 0, 100% 100%);
  background-color: ${COLORS.DARK};
  width: 0.5rem;
  height: 1rem;
`;

const username = css`
  font-size: ${FONT_SIZES.S};
  width: fit-content;
`;

const datetime = css`
  font-size: ${FONT_SIZES.S};
  align-self: flex-end;
`;

const contentCss = css`
  font-size: ${FONT_SIZES.M};
  white-space: pre-line;
  overflow-wrap: anywhere;
  flex: 0 1 auto;
`;

export default React.forwardRef(ChatRoomMessage);

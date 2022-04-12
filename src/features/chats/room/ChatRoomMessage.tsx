/** @jsxImportSource @emotion/react */

import React from "react";
import {ChatMessage} from "../../../entities/ChatMessage";
import {css} from "@emotion/react";
import {colors, textSizes} from "../../../styles/variables";
import {DateTime} from "luxon";

interface ChatRoomMessageProps {
    message: ChatMessage;
    isOwnMessage: boolean;
    chat_type: "user" | "channel";
}

function ChatRoomMessage({message, isOwnMessage, chat_type}: ChatRoomMessageProps) {

    const baseCss = css`
      max-width: calc(5 / 8 * 100%);
      min-width: 10rem;
      width: fit-content;
      margin: 0.25rem 1rem;
      padding: 0.5rem;
      box-sizing: border-box;

      color: ${colors.WHITE};
      border-radius: 5px;

      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    `;

    const ownMessageCss = css`${baseCss};
      align-self: flex-end;
      background-color: ${colors.PRIMARY};
    `;

    const otherMessageCss = css`${baseCss};
      background-color: ${colors.DARK};
    `;

    return (
        <div
            css={isOwnMessage ? ownMessageCss : otherMessageCss}>
            {!isOwnMessage && chat_type === "channel" ?
                <span css={css`
                  font-size: ${textSizes.S};
                  width: fit-content;
                `}>
                    {message.author.username}
                </span> :
                null
            }
            <span css={css`
              font-size: ${textSizes.M};
            `}>
            {message.content}
            </span>
            <span css={css`
              font-size: ${textSizes.S};
              align-self: flex-end;
            `}>
            {DateTime.fromISO(message.timestamp).toLocaleString(DateTime.DATETIME_SHORT)}
            </span>
        </div>
    );
}

export default ChatRoomMessage;
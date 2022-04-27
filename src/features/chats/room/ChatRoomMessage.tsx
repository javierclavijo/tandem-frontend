/** @jsxImportSource @emotion/react */

import React from "react";
import {ChatMessage} from "../../../entities/ChatMessage";
import {css} from "@emotion/react";
import {colors, textSizes} from "../../../styles/variables";
import {DateTime} from "luxon";

interface ChatRoomMessageProps {
    message: ChatMessage;
    isOwnMessage: boolean;
    type: "user" | "channel";
}

function ChatRoomMessage({message, isOwnMessage, type}: ChatRoomMessageProps) {

    const outerCss = css`
      display: flex;
      margin: 0.25rem 0.5rem;
    `;

    const ownMessageOuterCss = css`${outerCss};
      justify-content: flex-end;
    `;

    const innerCss = css`
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

    const ownMessageCss = css`${innerCss};
      align-self: flex-end;
      background-color: ${colors.PRIMARY};
      border-radius: 5px 0 5px 5px;
    `;

    const otherMessageCss = css`${innerCss};
      background-color: ${colors.DARK};
      border-radius: 0 5px 5px 5px;
    `;

    const speechBubbleOwnMessageCss = css`
      clip-path: polygon(100% 0, 0 0, 0 100%);
      background-color: ${colors.PRIMARY};
      width: 0.5rem;
      height: 1rem;
    `;

    const speechBubbleOtherMessageCss = css`
      clip-path: polygon(100% 0, 0 0, 100% 100%);
      background-color: ${colors.DARK};
      width: 0.5rem;
      height: 1rem;
    `;

    return (
        <div css={isOwnMessage ? ownMessageOuterCss : outerCss}>
            {!isOwnMessage ?
                <div css={speechBubbleOtherMessageCss}/>
                : null}
            <div
                css={isOwnMessage ? ownMessageCss : otherMessageCss}>
                {!isOwnMessage && type === "channel" ?
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
            {isOwnMessage ?
                <div css={speechBubbleOwnMessageCss}/> :
                null
            }
        </div>
    );
}

export default ChatRoomMessage;
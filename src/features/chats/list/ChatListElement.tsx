/** @jsxImportSource @emotion/react */

import React from "react";
import {Chat} from "../../../entities/Chat";
import {Link} from "react-router-dom";
import {imgCss, elementContentCss, imageContainerCss, linkCss, listElementCss} from "./styles";
import {css} from "@emotion/react";
import {DateTime} from "luxon";
import {textSizes} from "../../../styles/variables";

function ChatListElement({chat}: { chat: Chat }) {
    return (
        <div css={listElementCss}>
            <div css={elementContentCss}>
                <div css={imageContainerCss}>
                    <img src={require("../../../static/images/user_placeholder.png")} alt=""
                         css={imgCss}/>
                </div>
                <div css={css`
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  width: calc(100% - 3.75rem);
                  height: 100%;
                `}>
                    <span css={css`
                      width: 100%;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    `}>
                        <span>{chat.name}</span>
                        <span css={css`
                          font-size: ${textSizes.S};
                        `}>
                            {DateTime.fromISO(chat.messages[0].timestamp).toLocaleString(DateTime.DATE_SHORT)}
                        </span>
                    </span>
                    <span css={css`
                      font-size: ${textSizes.S};
                      max-width: 13rem;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      white-space: nowrap;
                    `}>
                    {chat.messages[0].author.username}: {chat.messages[0].content}
                    </span>
                </div>

            </div>
            <Link to={`/chats/${chat.id}`}
                  css={linkCss}/>
        </div>
    );
}

export default ChatListElement;
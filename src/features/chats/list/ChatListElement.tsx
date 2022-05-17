/** @jsxImportSource @emotion/react */

import React from 'react';
import { Link } from 'react-router-dom';
import { css } from '@emotion/react';
import { DateTime } from 'luxon';
import {
  elementContentCss, imageContainerCss, imgCss, linkCss,
} from '../styles';
import { Chat } from '../../../entities/Chat';
import { colors, textSizes } from '../../../styles/variables';

const defaultImg = require('../../../static/images/user_placeholder.png');

interface ChatListElementProps {
  chat: Chat;
  selected: boolean;
  latestMessageIsOwn: boolean;
}

function ChatListElement({ chat, selected, latestMessageIsOwn }: ChatListElementProps) {
  return (
    <div css={css`display: grid;
          border-bottom: 1px solid ${colors.LIGHT};
          color: ${selected ? colors.WHITE : colors.DARK};
          width: 100%;
          background-color: ${selected ? colors.PRIMARY : colors.WHITE};
          padding: 0 1rem;
          box-sizing: border-box;

          &:hover {
            ${!selected ? `background-color: ${colors.LIGHT};` : ''}
          }
        `}
    >
      <div css={elementContentCss}>
        <div css={imageContainerCss}>
          <img
            src={chat.image ?? defaultImg}
            alt=""
            css={imgCss}
          />
        </div>
        <div css={css`
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  width: 100%;
                  height: 100%;
                `}
        >
          <span css={css`
                      width: 100%;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    `}
          >
            <span>{chat.name}</span>
            <span css={css`
                          font-size: ${textSizes.S};
                        `}
            >
              {/* If the chat has messages, show the date when the latest message was sent. */}
              {chat.messages.length
                ? DateTime.fromISO(chat.messages[0].timestamp).toLocaleString(DateTime.DATE_SHORT)
                : null}
            </span>
          </span>
          <span css={css`
                      font-size: ${textSizes.S};
                      max-width: 13rem;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      white-space: nowrap;
                    `}
          >
            {/* If there's messages in the chat, show the first message and its author's username, or 'You'
                        if the current user is the author. */}
            {chat.messages.length
              ? latestMessageIsOwn ? `You: ${chat.messages[0].content}`
                : `${chat.messages[0].author.username}: ${chat.messages[0].content}`
              : null}
          </span>
        </div>
      </div>
      <Link
        to={`/chats/${chat.id}`}
        css={linkCss}
      />
    </div>
  );
}

export default ChatListElement;

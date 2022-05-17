/** @jsxImportSource @emotion/react */

import React from 'react';
import { css } from '@emotion/react';
import { useOutletContext } from 'react-router-dom';
import { colors } from '../../../styles/variables';
import { chatRoomCss, chatRoomHeaderCss } from './styles';
import { ChatHeaderProps } from '../../../components/ChatHeader';

function EmptyChatRoom() {
  const [, setHeader] = useOutletContext<[ChatHeaderProps | null, React.Dispatch<React.SetStateAction<ChatHeaderProps | null>>]>();

  React.useEffect(() => setHeader(null), [setHeader]);

  return (
    <div css={chatRoomCss}>
      <header css={chatRoomHeaderCss}>
        <h2>
          Chats
        </h2>
      </header>
      <div css={css`
              padding: 1rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100%;
            `}
      >
        <p css={css`
                  margin: 0;
                  color: ${colors.DARK};
                `}
        >
          Select a chat...
        </p>
      </div>
    </div>
  );
}

export default EmptyChatRoom;

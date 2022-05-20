/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";
import { colors } from "../../../styles/variables";
import { chatRoom, chatHeader } from "./styles";
import { useOutletContext } from "react-router-dom";
import { ChatHeaderProps } from "../../../components/ChatHeader";

function EmptyChatRoom() {
  const [, setHeader] =
    useOutletContext<
      [
        ChatHeaderProps | null,
        React.Dispatch<React.SetStateAction<ChatHeaderProps | null>>
      ]
    >();

  React.useEffect(() => setHeader(null), [setHeader]);

  return (
    <div css={chatRoom}>
      <header css={chatHeader}>
        <h2>Chats</h2>
      </header>
      <div css={container}>
        <p css={text}>Select a chat...</p>
      </div>
    </div>
  );
}

const container = css`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const text = css`
  margin: 0;
  color: ${colors.DARK};
`;

export default EmptyChatRoom;

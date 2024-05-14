import { css } from "@emotion/react";
import React, { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useOutletContext } from "react-router-dom";
import { animated } from "react-spring";
import { COLORS } from "../../../common/resources/style-variables";
import { useFadeIn } from "../../../common/transitions";
import { ChatHeaderProps } from "../../../components/ChatHeader";
import ChatList from "../components/ChatList/ChatList";
import { chatHeader, chatRoom } from "./styles";

/**
 * Empty chat page component. Only used in the desktop chat list.
 */
function DesktopEmptyChatPage() {
  const [, setHeader] =
    useOutletContext<
      [
        ChatHeaderProps | null,
        React.Dispatch<React.SetStateAction<ChatHeaderProps | null>>,
      ]
    >();

  useEffect(() => setHeader(null), [setHeader]);
  const transitionProps = useFadeIn();

  return (
    <animated.div css={chatRoom} style={transitionProps}>
      <header css={chatHeader}>
        <h2>Chats</h2>
      </header>
      <div css={container}>
        <p css={text}>Select a chat...</p>
      </div>
    </animated.div>
  );
}

/**
 * Empty chat page component.
 */
function EmptyChatPage() {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  return isDesktop ? <DesktopEmptyChatPage /> : <ChatList />;
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
  color: ${COLORS.DARK};
`;

export default EmptyChatPage;

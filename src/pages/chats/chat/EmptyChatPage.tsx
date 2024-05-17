import { css } from "@emotion/react";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { animated } from "react-spring";
import { COLORS } from "../../../common/constants";
import { useIsDesktop } from "../../../common/hooks";
import { useFadeIn } from "../../../common/transitions";
import ChatList from "../components/ChatList/ChatList";
import { useSetChatHeader } from "../hooks";
import { chatHeader, chatRoom } from "./styles";

/**
 * Empty chat page component. Only used in the desktop chat list.
 */
function DesktopEmptyChatPage() {
  const setHeader = useSetChatHeader();

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
  const isDesktop = useIsDesktop();
  return (
    <>
      <Helmet title="Chats | LangFlow" />
      {isDesktop ? <DesktopEmptyChatPage /> : <ChatList />}
    </>
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
  color: ${COLORS.DARK};
`;

export default EmptyChatPage;

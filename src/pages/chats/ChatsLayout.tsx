import { css } from "@emotion/react";
import { useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { animated } from "react-spring";
import Header from "../../common/components/Header/Header";
import Tabs from "../../common/components/Tabs";
import { useIsDesktop } from "../../common/hooks";
import { useFadeIn } from "../../common/transitions";
import { chatRoom, chatRoomMobile } from "./chat/styles";
import ChatHeader from "./components/ChatHeader";
import ChatList from "./components/ChatList/ChatList";
import { useWsChatListener } from "./hooks";
import { chatMain, chatMainMobile } from "./styles";
import { ChatHeaderData } from "./types";

/**
 * Main chat component. Holds the chat list, chat room and user/channel detail components.
 */
const ChatsLayout = () => {
  const params = useParams();
  const isDesktop = useIsDesktop();
  const transitionProps = useFadeIn();
  useWsChatListener();

  /**
   * State used by the router outlet context which controls the header's state.
   * This way, the header's data can be obtained from the view components,
   * without them having to contain the header themselves.
   */
  const [header, setHeader] = useState<ChatHeaderData | null>(null);

  return isDesktop ? (
    /**
     * Desktop layout. Displays the chat list to the left of the router's outlet.
     */
    <div css={baseAppContainerWithoutTabs}>
      <Header />
      <main css={chatMain}>
        <ChatList />
        <animated.section
          css={isDesktop ? chatRoom : chatRoomMobile}
          style={transitionProps}
        >
          {header ? <ChatHeader {...header} /> : null}
          <Outlet context={[header, setHeader]} />
        </animated.section>
      </main>
    </div>
  ) : (
    /**
     * Mobile layout. The grid layout and the elements displayed (nav, chat header and tabs) vary depending on the
     * current route.
     */
    <div
      css={params.id ? baseAppContainerWithoutTabs : baseAppContainerWithTabs}
    >
      {params.id && header ? <ChatHeader {...header} /> : <Header />}
      <main css={chatMainMobile}>
        <Outlet context={[header, setHeader]} />
      </main>
      {!params.id ? <Tabs /> : null}
    </div>
  );
};

export const baseAppContainer = css`
  // Main page layout
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  max-width: 100%;
`;

export const baseAppContainerWithoutTabs = css`
  ${baseAppContainer};
  grid-template-rows: 5rem 1fr;
  grid-template-areas:
    "header"
    "main";
`;

export const baseAppContainerWithTabs = css`
  ${baseAppContainer};
  // Main page layout with tabs
  grid-template-rows: 5rem 1fr 3rem;
  grid-template-areas:
    "header"
    "main"
    "tabs";

  @media (min-width: 1024px) {
    // Set "tabs" area height to zero in desktop layout
    grid-template-rows: 5rem 1fr 0;
  }
`;

export default ChatsLayout;

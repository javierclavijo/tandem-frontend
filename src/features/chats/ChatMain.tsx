/** @jsxImportSource @emotion/react */

import React from "react";
import { InfiniteData, useQueryClient } from "react-query";
import { useMediaQuery } from "react-responsive";
import { Outlet, useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import ChatHeader, { ChatHeaderProps } from "../../components/ChatHeader";
import Nav from "../../components/Header/Nav";
import Tabs from "../../components/Tabs";
import { Chat } from "../../entities/Chat";
import { ChatMessageResponse } from "../../entities/ChatMessage";
import {
  baseAppContainerWithoutTabs,
  baseAppContainerWithTabs,
} from "../../styles/layout";
import ChatList from "./list/ChatList";
import { chatRoom, chatRoomMobile } from "./room/styles";
import { chatMain, chatMainMobile } from "./styles";
import useAuth from "../auth/AuthContext";
import { useRedirectIfNotLoggedIn } from "../auth/hooks";
import { useFadeIn } from "../../utils/transitions";
import { animated } from "react-spring";

/**
 * Main chat component. Holds the chat list, chat room and user/channel detail components.
 */
function ChatMain() {
  const queryClient = useQueryClient();
  const params = useParams();
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const { isLoggedIn } = useAuth();
  const transitionProps = useFadeIn();
  useRedirectIfNotLoggedIn("/login");

  /**
   * State used by the router outlet context which controls the header's state. This way, the header's data can be
   * obtained from the view components, without them having to contain the header themselves.
   */
  const [header, setHeader] = React.useState<ChatHeaderProps | null>(null);

  /**
   * Holds the WebSocket connection to the server. Closes the connection if the user logs out.
   */
  const { lastJsonMessage } = useWebSocket(
    `${process.env.REACT_APP_WS_URL}/ws/chats/`,
    {
      onClose: () => console.error("Chat socket closed unexpectedly"),
      shouldReconnect: () => true,
      share: true,
    },
    isLoggedIn
  );

  /**
   * Updates the chat list and the corresponding chat messages query whenever a message is received or sent.
   */
  React.useEffect(() => {
    if (!lastJsonMessage) {
      return;
    }

    const message = lastJsonMessage.message;
    if (message) {
      queryClient.setQueryData<Chat[] | undefined>(
        ["chats", "list", "all"],
        (old) => {
          if (old !== undefined) {
            const oldChat = old.find((c) => c.id === message.chat_id);
            if (oldChat) {
              oldChat.messages = [message];
            }
          }
          return old;
        }
      );

      queryClient.setQueryData<InfiniteData<ChatMessageResponse> | undefined>(
        ["chats", "messages", message.chat_id],
        (old) => {
          if (old !== undefined) {
            // Add the message to the first page, reassign the page in the array so that the
            // bottom-scrolling effect hook is triggered.
            const firstPage = { ...old.pages[0] };
            old.pages[0] = {
              ...firstPage,
              results: [message, ...firstPage.results],
            };
          }
          return old;
        }
      );
    }
  }, [lastJsonMessage, queryClient]);

  return isDesktop ? (
    /**
     * Desktop layout. Displays the chat list to the left of the router's outlet.
     */
    <div css={baseAppContainerWithoutTabs}>
      <Nav />
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
      {params.id && header ? <ChatHeader {...header} /> : <Nav />}
      <main css={chatMainMobile}>
        <Outlet context={[header, setHeader]} />
      </main>
      {!params.id ? <Tabs /> : null}
    </div>
  );
}

export default ChatMain;

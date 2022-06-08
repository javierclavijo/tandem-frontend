/** @jsxImportSource @emotion/react */

import React from "react";
import { useParams } from "react-router-dom";
import { useChat, useSetChatRoomHeader } from "../hooks";
import useAuth from "../../auth/AuthContext";
import { css } from "@emotion/react";
import ChatRoomMessage from "./ChatRoomMessage";
import ChatInputForm from "./ChatInputForm";
import { useMediaQuery } from "react-responsive";
import { chatRoom, chatRoomMobile } from "./styles";
import InfiniteScroll from "react-infinite-scroll-component";
import { animated } from "react-spring";
import { useFadeIn } from "../../../utils/transitions";

/**
 * Renders a chat's messages, plus the input form to send messages to the chat.
 */
function ChatRoom() {
  const params = useParams();
  const { user } = useAuth();
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const transitionProps = useFadeIn();

  /**
   * Ref for the message container div. Used to scroll to the bottom of the page when necessary.
   */
  const messageContainerRef = React.useRef<HTMLDivElement>(null);

  /**
   * Infinite query which fetches and holds the chat's messages.
   */
  const { data, chat, fetchNextPage, hasNextPage } = useChat(
    params.id as string,
    {
      staleTime: 15000,
    }
  );

  /**
   * Set the chat header's data.
   */
  useSetChatRoomHeader(chat);

  return chat && data ? (
    <animated.div
      css={isDesktop ? chatRoom : chatRoomMobile}
      style={transitionProps}
    >
      <div
        id="chat-messages-container"
        ref={messageContainerRef}
        css={container}
      >
        <InfiniteScroll
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<div />}
          dataLength={data.pages.length}
          scrollableTarget="chat-messages-container"
          style={{ display: "flex", flexDirection: "column-reverse" }}
          inverse={true}
        >
          {data?.pages.reverse().map((page, pageIndex) => (
            <React.Fragment key={`page-${pageIndex}`}>
              {[...page.results].map((message) => (
                <ChatRoomMessage
                  message={message}
                  isOwnMessage={user?.id === message.author.id}
                  type={chat?.type}
                  key={message.id}
                />
              ))}
            </React.Fragment>
          ))}
        </InfiniteScroll>
      </div>
      <ChatInputForm chat={chat} />
    </animated.div>
  ) : null;
}

const container = css`
  overflow: auto;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
`;

export default ChatRoom;

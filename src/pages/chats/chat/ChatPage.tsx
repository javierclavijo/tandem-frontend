import { css } from "@emotion/react";
import React, { useRef } from "react";
import { Helmet } from "react-helmet-async";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { animated } from "react-spring";
import useAuth from "../../../common/context/AuthContext/AuthContext";
import { useIsDesktop, useTimeoutHandler } from "../../../common/hooks";
import { useFadeIn } from "../../../common/transitions";
import { useSetChatRoomHeader } from "../hooks";
import { useChat } from "../queries";
import ChatInputForm from "./components/ChatInputForm";
import ChatRoomMessage from "./components/ChatRoomMessage";
import { chatRoom, chatRoomMobile } from "./styles";

/**
 * Renders a chat's messages, plus the input form to send messages to the chat.
 */
const ChatPage = () => {
  const params = useParams();
  const { user } = useAuth();
  const isDesktop = useIsDesktop();
  const transitionProps = useFadeIn();

  /**
   * Infinite query which fetches and holds the chat's messages.
   */
  const { data, chat, fetchNextPage, hasNextPage } = useChat(
    params.id as string,
    {
      staleTime: 15000,
    },
  );

  /**
   * Set the chat header's data.
   */
  useSetChatRoomHeader(chat);

  /**
   * Ref for the message container div. Used to scroll to the bottom of the page
   * when necessary.
   */
  const messageContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Scrolls to bottom after a timeout.
   */
  const onMessageSend = useTimeoutHandler(
    () =>
      messageContainerRef.current?.scroll({
        top: messageContainerRef.current.offsetHeight,
        behavior: "smooth",
      }),
    25,
  );

  if (chat == null || data == null) {
    return null;
  }

  return (
    <>
      <Helmet title="Chats | LangFlow" />
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
            aria-live="polite"
          >
            {data?.pages.reverse().map((page, pageIndex) => (
              <React.Fragment key={`page-${pageIndex}`}>
                {[...page.results].map((message) => (
                  <ChatRoomMessage
                    authorName={message.author.username}
                    content={message.content}
                    timestamp={message.timestamp}
                    isOwnMessage={user?.id === message.author.id}
                    chatType={chat?.type}
                    key={message.id}
                  />
                ))}
              </React.Fragment>
            ))}
          </InfiniteScroll>
        </div>
        <ChatInputForm
          chatId={chat.id}
          chatType={chat.type}
          onMessageSend={onMessageSend}
        />
      </animated.div>
    </>
  );
};

const container = css`
  overflow: auto;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
`;

export default ChatPage;

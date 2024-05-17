import { css } from "@emotion/react";
import React, { useRef } from "react";
import { Helmet } from "react-helmet-async";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { animated } from "react-spring";
import useAuth from "../../../common/context/AuthContext/AuthContext";
import { useIsDesktop } from "../../../common/hooks";
import { useFadeIn } from "../../../common/transitions";
import { useSetChatRoomHeader } from "../hooks";
import { useChat } from "../queries";
import ChatInputForm from "./components/ChatInputForm";
import ChatRoomMessage from "./components/ChatRoomMessage";
import { chatRoom, chatRoomMobile } from "./styles";

/**
 * Renders a chat's messages, plus the input form to send messages to the chat.
 */
function ChatPage() {
  const params = useParams();
  const { user } = useAuth();
  const isDesktop = useIsDesktop();
  const transitionProps = useFadeIn();

  /**
   * Ref for the message container div. Used to scroll to the bottom of the page when necessary.
   */
  const messageContainerRef = useRef<HTMLDivElement>(null);

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
        <ChatInputForm chatId={chat.id} chatType={chat.type} />
      </animated.div>
    </>
  );
}

const container = css`
  overflow: auto;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
`;

export default ChatPage;

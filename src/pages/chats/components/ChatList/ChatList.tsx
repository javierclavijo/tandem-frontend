import { css } from "@emotion/react";
import { Plus } from "iconoir-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { animated } from "react-spring";
import { COLORS } from "../../../../common/constants";
import useAuth from "../../../../common/context/AuthContext/AuthContext";
import { getChatLastMessageDisplayText } from "../../../../common/functions";
import { useIsDesktop } from "../../../../common/hooks";
import { useFadeIn } from "../../../../common/transitions";
import { messageSortFn } from "../../hooks";
import { useAllChatsList } from "../../queries";
import {
  listContainer,
  listContainerMobile,
  listElementContainerCss,
} from "../../styles";
import ChatListElement from "./ChatListElement";
import ChatListFilter from "./ChatListFilter";
import NewChannelModal from "./NewChannelModal";

/**
 * Chat list section component. Holds the chat list, the filtering input and the channel creation button.
 */
const ChatList = () => {
  const params = useParams();
  const isDesktop = useIsDesktop();
  const transitionProps = useFadeIn();
  const { user } = useAuth();
  const { data } = useAllChatsList();

  /**
   * Controls the chat list filter state.
   */
  const [filter, setFilter] = useState<string>("");
  /**
   * Controls whether the channel creation modal is open.
   */
  const [isChannelCreationModalOpen, setIsChannelCreationModalOpen] =
    useState<boolean>(false);

  // Sort chats according to their latest messages' sent datetime.
  const sortedFilteredElements = useMemo(
    () =>
      data
        ?.filter((chat) =>
          chat.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()),
        )
        .sort((a, b) => messageSortFn(a.messages[0], b.messages[0])),
    [data, filter],
  );

  const onChannelCreationModalClose = () =>
    setIsChannelCreationModalOpen(false);

  if (data == null || user == null) {
    return null;
  }

  return (
    <>
      <animated.section
        css={isDesktop ? listContainer : listContainerMobile}
        style={transitionProps}
      >
        {/* Chat list filter */}
        <ChatListFilter value={filter} onFilterChange={setFilter} />

        {/* The list itself */}
        <ul css={listElementContainerCss} role="navigation">
          {sortedFilteredElements?.map((chat) => (
            <ChatListElement
              chatId={chat.id}
              chatName={chat.name}
              chatImage={chat.image}
              content={getChatLastMessageDisplayText(chat.messages[0], user)}
              lastMessageDateTime={chat.messages[0].timestamp}
              selected={chat.id === params.id}
              key={chat.id}
            />
          ))}

          {/* Empty list. Has different strings for cases where the user has 
              chats and is filtering, and where the user doesn't have any chats.
              */}
          {!sortedFilteredElements?.length && (
            <li css={emptyList}>
              <p>
                {data.length
                  ? "No chats match your query."
                  : "You don't have any chats yet."}
              </p>
            </li>
          )}
        </ul>

        {/* Channel creation button */}
        <button
          css={newChatButtonContainer}
          onClick={() => setIsChannelCreationModalOpen(true)}
          aria-label="Create new channel"
        >
          <Plus height="2rem" width="2rem" color={COLORS.WHITE} />
        </button>
      </animated.section>

      {/* Channel creation modal */}
      <NewChannelModal
        isOpen={isChannelCreationModalOpen}
        onRequestClose={onChannelCreationModalClose}
      />
    </>
  );
};

const newChatButtonContainer = css`
  position: absolute;
  background-color: ${COLORS.PRIMARY};
  border-radius: 50%;
  padding: 0.25rem;
  bottom: 0;
  right: 0;
  margin: 1rem;
  z-index: 10;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.1s;
  cursor: pointer;

  &:hover,
  &:active,
  &:focus {
    background-color: ${COLORS.DARK_PRIMARY};
    outline: none;
  }
`;

const emptyList = css`
  padding: 0 1rem 1rem 1rem;
`;

export default ChatList;

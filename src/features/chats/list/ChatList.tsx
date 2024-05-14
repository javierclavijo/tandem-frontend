import { css } from "@emotion/react";
import { Plus } from "iconoir-react";
import React from "react";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { animated } from "react-spring";
import { COLORS } from "../../../common/resources/style-variables";
import { useFadeIn } from "../../../common/transitions";
import useAuth from "../../../pages/auth/AuthContext";
import { useAllChatList } from "../hooks";
import { listContainer, listContainerMobile } from "../styles";
import ChatListElements from "./ChatListElements";
import ChatListFilter from "./ChatListFilter";
import NewChannelModal from "./NewChannelModal";

/**
 * Chat list section component. Holds the chat list, the filtering input and the channel creation button.
 */
function ChatList() {
  const params = useParams();
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const transitionProps = useFadeIn();
  const { data } = useAllChatList();
  const { user } = useAuth();

  /**
   * Controls the chat list filter state.
   */
  const [filter, setFilter] = React.useState<string>("");

  /**
   * Controls whether the channel creation modal is open.
   */
  const [isChannelCreationModalOpen, setIsChannelCreationModalOpen] =
    React.useState<boolean>(false);

  return (
    <>
      <animated.section
        css={isDesktop ? listContainer : listContainerMobile}
        style={transitionProps}
      >
        {/* Chat list filter */}
        <ChatListFilter setFilter={setFilter} />

        {/* Chat list elements */}
        {data && user ? (
          <ChatListElements
            data={data}
            filter={filter}
            selectedId={params.id}
            userId={user?.id}
          />
        ) : null}

        {/* Channel creation button */}
        <button
          css={newChatButtonContainer}
          onClick={() => setIsChannelCreationModalOpen(true)}
          aria-label="Create new channel"
        >
          <Plus height={"2rem"} width={"2rem"} color={COLORS.WHITE} />
        </button>
      </animated.section>

      {/* Channel creation modal */}
      <NewChannelModal
        isOpen={isChannelCreationModalOpen}
        setIsOpen={setIsChannelCreationModalOpen}
      />
    </>
  );
}

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

export default ChatList;

/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { Plus } from "iconoir-react";
import React from "react";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import Button from "../../../components/Button";
import { colors } from "../../../styles/variables";
import useAuth from "../../auth/AuthContext";
import { useAllChatList } from "../hooks";
import { listContainer, listContainerMobile } from "../styles";
import ChatListElements from "./ChatListElements";
import ChatListFilter from "./ChatListFilter";
import NewChannelModal from "./NewChannelModal";
import { animated } from "react-spring";
import { useFadeIn } from "../../../utils/transitions";

function ChatList() {
  const params = useParams();
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  const [filter, setFilter] = React.useState<string>("");

  const { data } = useAllChatList();
  const { user } = useAuth();
  const transitionProps = useFadeIn();

  const [isChannelCreationModalOpen, setIsChannelCreationModalOpen] =
    React.useState<boolean>(false);

  return (
    <React.Fragment>
      <animated.section css={isDesktop ? listContainer : listContainerMobile} style={transitionProps}>
        <ChatListFilter setFilter={setFilter} />
        {data && user ? (
          <ChatListElements
            data={data}
            filter={filter}
            selectedId={params.id}
            userId={user?.id}
          />
        ) : null}
        <div css={newChatButtonContainer}>
          <Button
            visible={true}
            onClick={() => setIsChannelCreationModalOpen(true)}
          >
            <Plus height={"2rem"} width={"2rem"} color={colors.WHITE} />
          </Button>
        </div>
      </animated.section>
      <NewChannelModal
        isOpen={isChannelCreationModalOpen}
        setIsOpen={setIsChannelCreationModalOpen}
      />
    </React.Fragment>
  );
}

const newChatButtonContainer = css`
  position: absolute;
  background-color: ${colors.PRIMARY};
  border-radius: 50%;
  padding: 0.25rem;
  bottom: 0;
  right: 0;
  margin: 1rem;
  z-index: 10;
`;

export default ChatList;

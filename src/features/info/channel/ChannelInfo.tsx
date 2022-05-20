/** @jsxImportSource @emotion/react */

import React from "react";
import useAuth from "../../auth/AuthContext";
import { css } from "@emotion/react";
import DescriptionTextarea from "../components/DescriptionTextarea";
import {
  descriptionSection,
  infoSection,
  listSection,
  listSectionHeader,
  profileImg,
} from "../styles";
import InfoListElement from "../components/InfoListElement";
import { ChannelNameInput } from "../components/NameInput";
import LanguageBadge from "../../../components/LanguageBadge";
import { colors, textSizes } from "../../../styles/variables";
import ChannelEditLanguageBadge from "./ChannelEditLanguageBadge";
import ImageInput from "../components/ImageInput";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { ChatHeaderProps } from "../../../components/ChatHeader";
import Button from "../../../components/Button";
import { FastArrowDownBox, FastArrowUpBox } from "iconoir-react";
import ShareLink from "../../../components/ShareLink";
import {
  buttonWithoutBackgroundAndBorder,
  modal,
  modalButton,
} from "../../../styles/components";
import ReactModal from "react-modal";
import {
  useChangeUserRole,
  useChannel,
  useDeleteChannel,
  useJoinChannel,
  useLeaveChannel,
} from "./hooks";
import { useJoinWSChat } from "../../chats/hooks";

const defaultImg = require("../../../static/images/user_placeholder.png");

// Set the modal's app element to "hide the application from assistive screenreaders and other assistive technologies
// while the modal is open" (see react-modal docs: https://reactcommunity.org/react-modal/examples/set_app_element/).
ReactModal.setAppElement("#root");

function ChannelInfo() {
  /**
   * Displays a channel's details: image, name, language and level, description and members.
   */

  const params = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const [, setHeader] =
    useOutletContext<
      [
        ChatHeaderProps | null,
        React.Dispatch<React.SetStateAction<ChatHeaderProps | null>>
      ]
    >();
  const navigate = useNavigate();

  /**
   * Controls whether the user is a member of the channel, and their role in case they are.
   */
  const [userRole, setUserRole] = React.useState<string | null>(null);

  /**
   * Convenience function which determines if the user is staff (admin or moderator).
   */
  const userIsStaff = React.useCallback(
    () => userRole === "A" || userRole === "M",
    [userRole]
  );

  /**
   * Convenience function which determines if the user is the channel's admin.
   */
  const userIsAdmin = React.useCallback(() => userRole === "A", [userRole]);

  /**
   * Controls whether the channel deletion confirmation modal is open.
   */
  const [deletionModalIsOpen, setDeletionModalIsOpen] =
    React.useState<boolean>(false);

  /**
   * Controls whether the channel leave confirmation modal is open.
   */
  const [leaveChannelModalIsOpen, setLeaveChannelModalIsOpen] =
    React.useState<boolean>(false);

  /**
   * Query which fetches and holds the channel's data
   */
  const { data } = useChannel(params.id);

  const joinWSChat = useJoinWSChat();

  const { mutateAsync: joinMutateAsync } = useJoinChannel(data);

  const { mutateAsync: leaveMutateAsync } = useLeaveChannel(data);

  const handleJoinChannel = React.useCallback(async () => {
    const response = await joinMutateAsync();
    if (response?.status === 201 && params?.id) {
      joinWSChat(params.id);
      navigate(`/chats/${params.id}`);
    }
  }, [params?.id, joinMutateAsync, navigate, joinWSChat]);

  const handleLeaveChannel = React.useCallback(async () => {
    await leaveMutateAsync();
    setLeaveChannelModalIsOpen(false);
    navigate("/chats/");
  }, [leaveMutateAsync, navigate]);

  /**
   * Checks if the user is a member of the channel and set the 'isMember' state if applicable. If the user is also an
   * admin, set the user role state.
   */
  React.useEffect(() => {
    const userMembership = data?.memberships.find(
      (membership) => membership.user.id === user?.id
    );
    if (userMembership) {
      setUserRole(userMembership.role);
    }
  }, [data?.memberships, user]);

  /**
   * Channel deletion handler.
   */
  const handleDelete = useDeleteChannel(data);

  /**
   * User role changing handlers.
   */
  const { handlePromoteUser, handleDemoteUser } = useChangeUserRole(params.id);

  /**
   * Sets the header to render the title 'user info', plus a 'share' button which copies the channel's URL to the
   * clipboard on click. If the user is admin, add a button to delete the channel. Finally, a 'join channel' button is
   * added for users who are not members of the channel, and a 'leave channel' button is added for those who are
   * members (except for admins).
   */
  React.useEffect(() => {
    setHeader({
      title: "Channel info",
      actions: (
        <div css={header}>
          {!userRole ? (
            <button
              type="button"
              onClick={handleJoinChannel}
              css={headerButton}
            >
              Join channel
            </button>
          ) : !userIsAdmin() ? (
            <button
              type="button"
              onClick={() => setLeaveChannelModalIsOpen(true)}
              css={headerButton}
            >
              Leave channel
            </button>
          ) : null}
          {userIsAdmin() ? (
            <button
              onClick={() => setDeletionModalIsOpen(true)}
              css={headerButton}
            >
              Delete
            </button>
          ) : null}
          <ShareLink link={window.location.href} />
        </div>
      ),
    });
  }, [location.pathname, userRole, setHeader, userIsAdmin, handleJoinChannel]);

  return data ? (
    <div css={container}>
      <section css={infoSection}>
        {userIsStaff() && data ? (
          <React.Fragment>
            <ImageInput
              image={data.image}
              defaultImage={defaultImg}
              url={data.url}
              invalidateQueryKey={["channels", data.id]}
            />
            <ChannelNameInput data={data} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <img src={data.image ?? defaultImg} alt="" css={profileImg} />
            <p>{data?.name}</p>
          </React.Fragment>
        )}
        <p>
          Channel ·&nbsp;
          {data?.memberships.length}{" "}
          {data?.memberships.length === 1 ? "member" : "members"}
        </p>
        {userIsStaff() ? (
          <ChannelEditLanguageBadge data={data} bg={colors.DARK} />
        ) : (
          <LanguageBadge
            language={data.language}
            level={data.level}
            bg={colors.DARK}
          />
        )}
        <section css={descriptionSection}>
          {userIsStaff() && data ? (
            <DescriptionTextarea data={data} queryKey={"channels"} />
          ) : (
            <React.Fragment>
              <h3>Description</h3>
              <p>{data?.description}</p>
            </React.Fragment>
          )}
        </section>
      </section>
      <section css={listSection}>
        <h3 css={listSectionHeader}>Members</h3>
        {data?.memberships.map((membership) =>
          membership.user ? (
            <InfoListElement
              name={membership.user?.username}
              additionalInfo={
                membership.role === "A"
                  ? "Admin"
                  : membership.role === "M"
                  ? "Moderator"
                  : undefined
              }
              description={membership.user.description}
              key={membership.url}
              image={membership.user.image}
              link={`/chats/users/${membership.user.id}`}
              buttons={
                <React.Fragment>
                  {/* If the user is a regular user, show a button to promote them to
                                                 moderator. If they are a moderator, show a button to demote them to
                                                 regular user. If they are admin, show nothing. */}
                  {userIsAdmin() && membership.role === "U" ? (
                    <Button
                      visible={true}
                      onClick={async () =>
                        await handlePromoteUser(membership.url)
                      }
                    >
                      Promote
                      <FastArrowUpBox
                        color={colors.PRIMARY}
                        height={"1.5rem"}
                        width={"1.5rem"}
                      />
                    </Button>
                  ) : userIsAdmin() && membership.role === "M" ? (
                    <Button
                      visible={true}
                      onClick={async () =>
                        await handleDemoteUser(membership.url)
                      }
                    >
                      Demote
                      <FastArrowDownBox
                        color={colors.PRIMARY}
                        height={"1.5rem"}
                        width={"1.5rem"}
                      />
                    </Button>
                  ) : null}
                </React.Fragment>
              }
            />
          ) : null
        )}
        {/* Empty list */}
        {!data?.memberships.length ? (
          <article css={emptyContainer}>
            <p>This channel doesn't have any members yet.</p>
          </article>
        ) : null}
      </section>

      {/* Channel deletion confirmation modal */}
      <ReactModal
        isOpen={deletionModalIsOpen}
        onRequestClose={() => setDeletionModalIsOpen(false)}
        contentLabel="Delete channel"
        style={modal}
      >
        <p css={modalTitle}>Delete channel?</p>
        <div css={header}>
          <button onClick={handleDelete} css={modalButton}>
            Delete
          </button>
          <button
            onClick={() => setDeletionModalIsOpen(false)}
            css={cancelButton}
          >
            Cancel
          </button>
        </div>
      </ReactModal>

      {/* Channel leave confirmation modal */}
      <ReactModal
        isOpen={leaveChannelModalIsOpen}
        onRequestClose={() => setLeaveChannelModalIsOpen(false)}
        contentLabel="Leave channel"
        style={modal}
      >
        <p css={modalTitle}>Leave channel?</p>
        <div css={header}>
          <button onClick={handleLeaveChannel} css={modalButton}>
            Leave
          </button>
          <button
            onClick={() => setLeaveChannelModalIsOpen(false)}
            css={cancelButton}
          >
            Cancel
          </button>
        </div>
      </ReactModal>
    </div>
  ) : null;
}

const header = css`
  display: flex;
  gap: 1rem;
`;

const cancelButton = css`
  ${modalButton};
  background-color: ${colors.DARK}60;
`;

const headerButton = css`
  ${buttonWithoutBackgroundAndBorder};
  font-size: ${textSizes.S};
  color: white;
`;

const container = css`
  overflow-y: scroll;
`;

const emptyContainer = css`
  padding: 0.5rem 1rem;
`;

const modalTitle = css`
  margin-bottom: 1rem;
`;

export default ChannelInfo;

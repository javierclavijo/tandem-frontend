import { css } from "@emotion/react";
import { FastArrowDownSquare, FastArrowUpSquare } from "iconoir-react";
import React, { useCallback, useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { animated } from "react-spring";
import EditButton from "../../../common/components/EditButton";
import LanguageBadge from "../../../common/components/LanguageBadge";
import ShareLink from "../../../common/components/ShareLink";
import useAuth from "../../../common/context/AuthContext/AuthContext";
import { COLORS } from "../../../common/resources/style-variables";
import { useFadeIn } from "../../../common/transitions";
import DescriptionTextarea from "../components/DescriptionTextarea";
import ImageInput from "../components/ImageInput";
import InfoListElement from "../components/InfoListElement";
import { ChannelNameInput } from "../components/NameInput";
import { useJoinWSChat } from "../hooks";
import {
  descriptionSection,
  infoButton,
  infoSection,
  listSection,
  listSectionHeader,
  listSectionList,
  profileImg,
} from "../styles";
import { ChatHeaderData } from "../types";
import ChannelEditLanguageBadge from "./components/ChannelEditLanguageBadge";
import DeleteChannelModal from "./components/DeleteChannelModal";
import LeaveChannelModal from "./components/LeaveChannelModal";
import {
  useChangeUserRole,
  useChannel,
  useDeleteChannel,
  useJoinChannel,
  useLeaveChannel,
} from "./queries";

/**
 * Displays a channel's details: image, name, language and level, description and members.
 */
function ChannelPage() {
  const params = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const [, setHeader] =
    useOutletContext<
      [
        ChatHeaderData | null,
        React.Dispatch<React.SetStateAction<ChatHeaderData | null>>,
      ]
    >();
  const navigate = useNavigate();
  const transitionProps = useFadeIn();

  /**
   * Controls whether the user is a member of the channel, and their role in case they are.
   */
  const [userRole, setUserRole] = useState<string | null>(null);

  /**
   * Convenience function which determines if the user is staff (admin or moderator).
   */
  const userIsStaff = useCallback(
    () => userRole === "A" || userRole === "M",
    [userRole],
  );

  /**
   * Convenience function which determines if the user is the channel's admin.
   */
  const userIsAdmin = useCallback(() => userRole === "A", [userRole]);

  /**
   * Controls whether the channel deletion confirmation modal is open.
   */
  const [deletionModalOpen, setDeletionModalOpen] = useState<boolean>(false);

  /**
   * Controls whether the channel leave confirmation modal is open.
   */
  const [leaveChannelModalOpen, setLeaveChannelModalOpen] =
    useState<boolean>(false);

  /**
   * Query which fetches and holds the channel's data
   */
  const { data } = useChannel(params.id);

  const joinWSChat = useJoinWSChat();

  const { mutateAsync: joinMutateAsync } = useJoinChannel(data);

  const { mutateAsync: leaveMutateAsync } = useLeaveChannel(data);

  const handleJoinChannel = useCallback(async () => {
    const response = await joinMutateAsync();
    if (response?.status === 201 && params?.id) {
      joinWSChat(params.id);
      navigate(`/chats/${params.id}`);
    }
  }, [params?.id, joinMutateAsync, navigate, joinWSChat]);

  const handleLeaveChannel = useCallback(async () => {
    await leaveMutateAsync();
    setLeaveChannelModalOpen(false);
    navigate("/chats/");
  }, [leaveMutateAsync, navigate]);

  /**
   * Checks if the user is a member of the channel and set the 'isMember' state if applicable. If the user is also an
   * admin, set the user role state.
   */
  useEffect(() => {
    const userMembership = data?.memberships.find(
      (membership) => membership.user.id === user?.id,
    );
    if (userMembership) {
      setUserRole(userMembership.role);
    }
  }, [data?.memberships, user]);

  /**
   * Channel delete/leave handlers.
   */
  const handleDelete = useDeleteChannel(data);
  const handleDeleteModalClose = () => setDeletionModalOpen(false);
  const handleLeaveModalClose = () => setLeaveChannelModalOpen(false);

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
  useEffect(() => {
    setHeader({
      title: "Channel info",
      actions: (
        <div css={header}>
          {!userRole ? (
            <button type="button" onClick={handleJoinChannel} css={infoButton}>
              Join channel
            </button>
          ) : !userIsAdmin() ? (
            <button
              type="button"
              onClick={() => setLeaveChannelModalOpen(true)}
              css={infoButton}
            >
              Leave channel
            </button>
          ) : null}
          {userIsAdmin() ? (
            <button onClick={() => setDeletionModalOpen(true)} css={infoButton}>
              Delete
            </button>
          ) : null}
          <ShareLink link={window.location.href} />
        </div>
      ),
    });
  }, [location.pathname, userRole, setHeader, userIsAdmin, handleJoinChannel]);

  return data ? (
    <animated.div css={container} style={transitionProps}>
      <section css={infoSection}>
        {userIsStaff() && data ? (
          <>
            <ImageInput
              image={data.image}
              // TODO: remove direct references like this.
              defaultImage="/images/user-placeholder.png"
              url={data.url}
              invalidateQueryKey={["channels", data.id]}
            />
            <ChannelNameInput data={data} />
          </>
        ) : (
          <>
            <img
              src={data.image ?? "/images/user-placeholder.png"}
              alt=""
              css={profileImg}
            />
            <p>{data?.name}</p>
          </>
        )}
        <p>
          Channel ·&nbsp;
          {data?.memberships.length}{" "}
          {data?.memberships.length === 1 ? "member" : "members"}
        </p>
        {userIsStaff() ? (
          <ChannelEditLanguageBadge data={data} bg={COLORS.DARK} />
        ) : (
          <LanguageBadge
            language={data.language}
            level={data.level}
            bg={COLORS.DARK}
          />
        )}
        <section css={descriptionSection}>
          {userIsStaff() && data ? (
            <DescriptionTextarea data={data} queryKey={"channels"} />
          ) : (
            <>
              <h3>Description</h3>
              <p>{data?.description}</p>
            </>
          )}
        </section>
      </section>
      <section css={listSection}>
        <h3 css={listSectionHeader}>Members</h3>
        <ul css={listSectionList}>
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
                  <>
                    {/* If the user is a regular user, show a button to promote them to
                                                 moderator. If they are a moderator, show a button to demote them to
                                                 regular user. If they are admin, show nothing. */}
                    {userIsAdmin() && membership.role === "U" ? (
                      <EditButton
                        onClick={async () =>
                          await handlePromoteUser(membership.url)
                        }
                      >
                        Promote
                        <FastArrowUpSquare
                          color={COLORS.PRIMARY}
                          height={"1.5rem"}
                          width={"1.5rem"}
                        />
                      </EditButton>
                    ) : userIsAdmin() && membership.role === "M" ? (
                      <EditButton
                        onClick={async () =>
                          await handleDemoteUser(membership.url)
                        }
                      >
                        Demote
                        <FastArrowDownSquare
                          color={COLORS.PRIMARY}
                          height={"1.5rem"}
                          width={"1.5rem"}
                        />
                      </EditButton>
                    ) : null}
                  </>
                }
              />
            ) : null,
          )}
          {/* Empty list */}
          {!data?.memberships.length ? (
            <li css={emptyContainer}>
              <p>This channel doesn&apos;t have any members yet.</p>
            </li>
          ) : null}
        </ul>
      </section>

      {/* Channel deletion confirmation modal */}
      <DeleteChannelModal
        isOpen={deletionModalOpen}
        onRequestClose={handleDeleteModalClose}
        onDelete={handleDelete}
      />

      {/* Channel leave confirmation modal */}
      <LeaveChannelModal
        isOpen={leaveChannelModalOpen}
        onRequestClose={handleLeaveModalClose}
        onLeave={handleLeaveChannel}
      />
    </animated.div>
  ) : null;
}

const header = css`
  display: flex;
  gap: 1rem;
`;

const container = css`
  overflow-y: scroll;
`;

const emptyContainer = css`
  padding: 0.5rem 1rem;
`;

export default ChannelPage;

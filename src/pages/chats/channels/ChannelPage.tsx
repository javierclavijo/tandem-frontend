import { css } from "@emotion/react";
import { FastArrowDownSquare, FastArrowUpSquare } from "iconoir-react";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { animated } from "react-spring";
import EditButton from "../../../common/components/EditButton";
import LanguageBadge from "../../../common/components/LanguageBadge";
import ProfileImage from "../../../common/components/ProfileImage";
import ShareLink from "../../../common/components/ShareLink";
import { COLORS } from "../../../common/constants";
import useAuth from "../../../common/context/AuthContext/AuthContext";
import userPlaceholderImage from "../../../common/static/images/user-placeholder.png";
import { useFadeIn } from "../../../common/transitions";
import DescriptionTextarea from "../components/DescriptionTextarea";
import ImageInput from "../components/ImageInput";
import InfoListElement from "../components/InfoListElement";
import { ChannelNameInput } from "../components/NameInput";
import { useJoinWsChat, useSetChatHeader } from "../hooks";
import {
  descriptionSection,
  infoButton,
  infoSection,
  listSection,
  listSectionHeader,
  listSectionList,
} from "../styles";
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
 * Displays a channel's details: image, name, language and level, description
 * and members.
 */
const ChannelPage = () => {
  const params = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const transitionProps = useFadeIn();
  const joinChat = useJoinWsChat();
  const setHeader = useSetChatHeader();

  const { data } = useChannel(params.id);
  const { mutateAsync: joinMutateAsync } = useJoinChannel(data);
  const { mutateAsync: deleteMutateAsync } = useDeleteChannel(data);
  const { mutateAsync: leaveMutateAsync } = useLeaveChannel(data);

  /**
   * Controls whether the channel deletion confirmation modal is open.
   */
  const [deletionModalOpen, setDeletionModalOpen] = useState<boolean>(false);
  /**
   * Controls whether the channel leave confirmation modal is open.
   */
  const [leaveChannelModalOpen, setLeaveChannelModalOpen] =
    useState<boolean>(false);

  const userRole = data?.memberships.find(
    (membership) => membership.user.id === user?.id,
  )?.role;

  const userIsAdmin = userRole === "A";
  const userIsStaff = userIsAdmin || userRole === "M";

  /**
   * User role changing handlers.
   */
  const { handlePromoteUser, handleDemoteUser } = useChangeUserRole(params.id);
  /**
   * Channel delete/leave handlers.
   */
  const handleDeleteModalClose = () => setDeletionModalOpen(false);
  const handleLeaveModalClose = () => setLeaveChannelModalOpen(false);
  const handleDelete = async () => await deleteMutateAsync();

  const handleLeaveChannel = useCallback(async () => {
    await leaveMutateAsync();
    setLeaveChannelModalOpen(false);
    navigate("/chats/");
  }, [leaveMutateAsync, navigate]);

  /**
   * Channel join handler.
   */
  const handleJoinChannel = useCallback(async () => {
    const response = await joinMutateAsync();
    if (response?.status === 201 && params?.id) {
      joinChat(params.id);
      navigate(`/chats/${params.id}`);
    }
  }, [params?.id, joinMutateAsync, navigate, joinChat]);

  /**
   * Sets the header to render the title 'user info', plus a 'share' button which copies the channel's URL to the
   * clipboard on click. If the user is admin, add a button to delete the channel. Finally, a 'join channel' button is
   * added for users who are not members of the channel, and a 'leave channel' button is added for those who are
   * members (except for admins).
   */
  // TODO: review the whole header thing.
  useEffect(() => {
    setHeader({
      title: "Channel info",
      actions: (
        <div css={header}>
          {!userRole ? (
            <button type="button" onClick={handleJoinChannel} css={infoButton}>
              Join channel
            </button>
          ) : !userIsAdmin ? (
            <button
              type="button"
              onClick={() => setLeaveChannelModalOpen(true)}
              css={infoButton}
            >
              Leave channel
            </button>
          ) : null}

          {userIsAdmin ? (
            <button onClick={() => setDeletionModalOpen(true)} css={infoButton}>
              Delete
            </button>
          ) : null}
          <ShareLink link={window.location.href} />
        </div>
      ),
    });
  }, [location.pathname, userRole, setHeader, userIsAdmin, handleJoinChannel]);

  if (data == null) {
    return null;
  }

  return (
    <>
      <Helmet title={`${data.name} | LangFlow`} />
      <animated.div css={container} style={transitionProps}>
        <section css={infoSection}>
          {userIsStaff ? (
            <>
              <ImageInput
                image={data.image}
                url={data.url}
                invalidateQueryKey={["channels", data.id]}
              />
              <ChannelNameInput data={data} />
            </>
          ) : (
            <>
              <ProfileImage
                src={data.image ?? userPlaceholderImage}
                alt=""
                css={css`
                  display: none;
                `}
              />
              <p>{data?.name}</p>
            </>
          )}

          <p>
            Channel ·&nbsp;
            {data?.memberships.length}&nbsp;
            {data?.memberships.length === 1 ? "member" : "members"}
          </p>

          {userIsStaff ? (
            <ChannelEditLanguageBadge data={data} bg={COLORS.DARK} />
          ) : (
            <LanguageBadge
              language={data.language}
              level={data.level}
              bg={COLORS.DARK}
            />
          )}

          <section css={descriptionSection}>
            {userIsStaff && data ? (
              <DescriptionTextarea data={data} queryKey="channels" />
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
            {/* TODO: refactor into its own component */}
            {data?.memberships.map((membership) => (
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
                    {/* If the user is a regular user, show a button to promote
                        them to moderator. If they are a moderator, show a 
                        button to demote them to regular user. If they are 
                      an admin, show nothing. */}
                    {!!userIsAdmin && membership.role === "U" && (
                      <EditButton
                        onClick={async () =>
                          await handlePromoteUser(membership.url)
                        }
                      >
                        Promote
                        <FastArrowUpSquare
                          color={COLORS.PRIMARY}
                          height="1.5rem"
                          width="1.5rem"
                        />
                      </EditButton>
                    )}

                    {!!userIsAdmin && membership.role === "M" && (
                      <EditButton
                        onClick={async () =>
                          await handleDemoteUser(membership.url)
                        }
                      >
                        Demote
                        <FastArrowDownSquare
                          color={COLORS.PRIMARY}
                          height="1.5rem"
                          width="1.5rem"
                        />
                      </EditButton>
                    )}
                  </>
                }
              />
            ))}

            {/* Empty list */}
            {data.memberships.length === 0 && (
              <li css={emptyContainer}>
                <p>This channel doesn&apos;t have any members yet.</p>
              </li>
            )}
          </ul>
        </section>
      </animated.div>

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
    </>
  );
};

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

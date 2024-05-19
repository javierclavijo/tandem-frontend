import { css } from "@emotion/react";
import { Plus } from "iconoir-react";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { animated } from "react-spring";
import LanguageBadge from "../../../common/components/LanguageBadge";
import ProfileImage from "../../../common/components/ProfileImage";
import { COLORS, LANGUAGE_INFO } from "../../../common/constants";
import useAuth from "../../../common/context/AuthContext/AuthContext";
import userPlaceholderImage from "../../../common/static/images/user-placeholder.png";
import { useFadeIn } from "../../../common/transitions";
import DescriptionTextarea from "../components/DescriptionTextarea";
import ImageInput from "../components/ImageInput";
import InfoListElement from "../components/InfoListElement";
import { UserNameInput } from "../components/NameInput";
import {
  getFriendFromFriendChat,
  useJoinWsChat,
  useSetChatHeader,
} from "../hooks";
import {
  descriptionSection,
  infoButton,
  infoSection,
  listSection,
  listSectionHeader,
  listSectionList,
} from "../styles";
import { UserLanguage } from "../types";
import DeleteLanguageModal from "./components/DeleteLanguageModal";
import NewLanguageModal from "./components/NewLanguageModal";
import SetPasswordModal from "./components/SetPasswordModal";
import UserInfoEditLanguageBadge from "./components/UserInfoEditLanguageBadge";
import {
  useCreateChatWithUser,
  useDeleteUserLanguage,
  useUser,
} from "./queries";

/**
 * User detail component.
 */
const UserPage = () => {
  const params = useParams();
  const { user: appUser } = useAuth();
  const navigate = useNavigate();
  const transitionProps = useFadeIn();
  const joinChat = useJoinWsChat();
  const setHeader = useSetChatHeader();

  const { data } = useUser(params.id);
  const { mutateAsync: deletionMutateAsync } = useDeleteUserLanguage();
  const { mutateAsync: creationMutateAsync } = useCreateChatWithUser(data);

  /**
   * Controls the language creation modal's rendering
   */
  const [passwordChangeModalIsOpen, setPasswordChangeModalIsOpen] =
    useState(false);
  /**
   * Controls the language creation modal's rendering
   */
  const [newLanguageModalIsOpen, setNewLanguageModalIsOpen] = useState(false);
  /**
   * Is set whenever a language's delete button is selected. Holds the selected
   * language's data
   */
  const [selectedDeleteLanguage, setSelectedDeleteLanguage] =
    useState<UserLanguage | null>(null);

  /**
   * Controls whether the info is editable (i.e. if edit controls are displayed)
   */
  const isEditable = appUser?.id != null && appUser?.id === data?.id;
  /**
   * Controls whether the user is a friend of the current user. Used to render
   * the 'chat with user' button set to true by default to avoid rendering the
   * button on the first render.
   */
  const isFriend = data?.friend_chats.some((chat) =>
    chat.users.some((chatUser) => chatUser.id === appUser?.id),
  );
  /**
   * Display name of the language selected for deletion, if there is one.
   */
  const selectedDeleteLanguageName =
    selectedDeleteLanguage != null
      ? LANGUAGE_INFO[selectedDeleteLanguage?.language].displayName
      : null;

  const onLanguageDelete = useCallback(async () => {
    if (selectedDeleteLanguage) {
      await deletionMutateAsync(selectedDeleteLanguage.url);
      setSelectedDeleteLanguage(null);
    }
  }, [deletionMutateAsync, selectedDeleteLanguage, setSelectedDeleteLanguage]);

  const onChatCreateClick = useCallback(async () => {
    const response = await creationMutateAsync();
    const newChatId = response?.data?.id;
    if (response?.status === 201 && newChatId) {
      joinChat(newChatId);
      navigate(`/chats/${newChatId}`);
    }
  }, [creationMutateAsync, navigate, joinChat]);

  const onDeleteLanguageModalClose = () => setSelectedDeleteLanguage(null);
  const onNewLanguageModalClose = () => setNewLanguageModalIsOpen(false);
  const onPasswordModalClose = () => setPasswordChangeModalIsOpen(false);

  /**
   * Set header to render the title 'user info', plus a button to chat with the
   * user if the user is not already a friend of the current user (i.e. doesn't
   * have any friend chats with them).
   */
  useEffect(() => {
    setHeader({
      title: "User info",
      actions: (
        // TODO: this doesn't look too good (open-closed).
        <>
          {!isFriend && (
            <button type="button" onClick={onChatCreateClick} css={infoButton}>
              Chat with user
            </button>
          )}

          {!!isEditable && (
            <button
              type="button"
              onClick={() => setPasswordChangeModalIsOpen(true)}
              css={infoButton}
            >
              Change password
            </button>
          )}
        </>
      ),
    });
  }, [
    isFriend,
    setHeader,
    onChatCreateClick,
    isEditable,
    setPasswordChangeModalIsOpen,
  ]);

  if (data == null) {
    return null;
  }

  return (
    <>
      <Helmet
        title={
          isEditable ? "Your Profile | LangFlow" : `${data.username} | LangFlow`
        }
      />
      <animated.div css={container} style={transitionProps}>
        {/* Main user information
            Contains the user's picture, username, languages and description.*/}
        <section css={infoSection}>
          {isEditable && data ? (
            <>
              <ImageInput
                image={data.image}
                url={data.url}
                invalidateQueryKey={["users", appUser?.id]}
              />
              <UserNameInput data={data} />
            </>
          ) : (
            <>
              <ProfileImage src={data.image ?? userPlaceholderImage} alt="" />
              <p>{data?.username}</p>
            </>
          )}

          {/* Languages
                
              If the view is editable, contains controls for creating, editing 
              and removing the user's languages. Else, it only displays the 
              languages */}
          <section css={languagesOuterContainer}>
            <h3>Languages</h3>
            <div css={languagesInnerContainer}>
              {isEditable ? (
                <>
                  {/* Render selects for the user's non-native languages, as 
                      native languages can't be edited by the user */}
                  {data.languages.map((language) =>
                    language.level === "NA" ? (
                      <LanguageBadge
                        language={language.language}
                        level={language.level}
                        backgroundColor={COLORS.DARK}
                        key={language.id}
                      />
                    ) : (
                      <div css={editableLanguage} key={language.id}>
                        <UserInfoEditLanguageBadge
                          id={language.id}
                          language={language.language}
                          level={language.level}
                          url={language.url}
                          backgroundColor={COLORS.DARK}
                          onDelete={() => setSelectedDeleteLanguage(language)}
                        />
                      </div>
                    ),
                  )}
                  <button
                    type="button"
                    onClick={() => setNewLanguageModalIsOpen(true)}
                    css={infoButton}
                  >
                    Add
                    <Plus />
                  </button>
                </>
              ) : (
                data.languages.map((language) => (
                  <LanguageBadge
                    language={language.language}
                    level={language.level}
                    backgroundColor={COLORS.DARK}
                    key={language.id}
                  />
                ))
              )}
            </div>
          </section>

          <section css={descriptionSection}>
            {isEditable ? (
              <DescriptionTextarea data={data} queryKey="users" />
            ) : (
              <>
                <h3>Description</h3>
                <p>{data?.description}</p>
              </>
            )}
          </section>
        </section>

        {/* Friends */}
        <section css={listSection}>
          <h3 css={listSectionHeader}>Friends</h3>
          <ul css={listSectionList}>
            {data?.friend_chats.map((chat) => {
              const friend = getFriendFromFriendChat(data, chat);
              if (friend) {
                return (
                  <InfoListElement
                    name={friend.username}
                    description={friend.description}
                    key={friend.id}
                    image={friend.image}
                    link={`/chats/users/${friend.id}`}
                  />
                );
              }
              return null;
            })}

            {/* Empty list */}
            {!data?.friend_chats.length && (
              <li css={emptyListContainer}>
                <p>
                  {isEditable
                    ? "You have not added any friends yet."
                    : "This user has not added any friends yet."}
                </p>
              </li>
            )}
          </ul>
        </section>

        {/* Channels*/}
        <section css={channelListContainer}>
          <h3 css={listSectionHeader}>Channels</h3>
          <ul css={listSectionList}>
            {data?.memberships.map((membership) => (
              <InfoListElement
                name={membership.channel.name}
                description={membership.channel.description}
                additionalInfo={membership.role === "A" ? "Admin" : undefined}
                key={membership.id}
                image={membership.channel.image}
                link={`/chats/channels/${membership.channel.id}`}
              />
            ))}

            {/* Empty list */}
            {data?.memberships.length === 0 && (
              <li css={emptyListContainer}>
                <p>
                  {isEditable
                    ? "You have not joined any channels yet."
                    : "This user has not joined any channels yet."}
                </p>
              </li>
            )}
          </ul>
        </section>
      </animated.div>

      {/* Language creation modal
          Only rendered if the profile is the session user's. Opens when the 
          'add a language' button is pressed. */}
      {!!isEditable && (
        <NewLanguageModal
          isOpen={newLanguageModalIsOpen}
          onRequestClose={onNewLanguageModalClose}
        />
      )}

      {/* Language deletion modal
          Only available if the profile is the session user's and a language has
          been selected for deletion (i.e. when a language's delete button has 
          been pressed.) */}
      {!!isEditable && (
        <DeleteLanguageModal
          isOpen={selectedDeleteLanguage != null}
          languageName={selectedDeleteLanguageName}
          onRequestClose={onDeleteLanguageModalClose}
          onDelete={onLanguageDelete}
        />
      )}

      {/* Set password modal.
          Only rendered if the profile is the user's. Opens when the 'change 
          password' button is pressed. */}
      {!!isEditable && (
        <SetPasswordModal
          isOpen={passwordChangeModalIsOpen}
          onRequestClose={onPasswordModalClose}
        />
      )}
    </>
  );
};

const container = css`
  overflow-y: scroll;
`;

const languagesOuterContainer = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`;

const languagesInnerContainer = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

const editableLanguage = css`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const emptyListContainer = css`
  padding: 0.5rem 1rem;
`;

const channelListContainer = css`
  ${listSection};
  padding-top: 0;
`;

export default UserPage;

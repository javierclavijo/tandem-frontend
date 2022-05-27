/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { Plus } from "iconoir-react";
import React from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { animated } from "react-spring";
import { ChatHeaderProps } from "../../../components/ChatHeader";
import LanguageBadge from "../../../components/LanguageBadge";
import { UserLanguage } from "../../../entities/User";
import { colors } from "../../../styles/variables";
import { useFadeIn } from "../../../utils/transitions";
import useAuth from "../../auth/AuthContext";
import { getFriendFromFriendChat, useJoinWSChat } from "../../chats/hooks";
import DescriptionTextarea from "../components/DescriptionTextarea";
import ImageInput from "../components/ImageInput";
import InfoListElement from "../components/InfoListElement";
import { UserNameInput } from "../components/NameInput";
import {
  descriptionSection,
  infoButton,
  infoSection,
  listSection,
  listSectionHeader,
  profileImg,
} from "../styles";
import DeleteLanguageModal from "./DeleteLanguageModal";
import { useCreateChatWithUser, useDeleteUserLanguage, useUser } from "./hooks";
import NewLanguageModal from "./NewLanguageModal";
import SetPasswordModal from "./SetPasswordModal";
import UserInfoEditLanguageBadge from "./UserInfoEditLanguageBadge";

const defaultImg = require("../../../static/images/user_placeholder.png");

export function UserInfo() {
  /**
   * User detail component.
   */

  const params = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [, setHeader] =
    useOutletContext<
      [
        ChatHeaderProps | null,
        React.Dispatch<React.SetStateAction<ChatHeaderProps | null>>
      ]
    >();
  const transitionProps = useFadeIn();

  /**
   * Holds the user's data
   */
  const { data } = useUser(params.id);

  /**
   * Controls whether the info is editable (i.e. if edit controls are displayed)
   */
  const [isEditable, setIsEditable] = React.useState<boolean>(false);

  /**
   * Controls whether the user is a friend of the current user. Used to render the 'chat with user' button.
   * Set to true by default to avoid rendering the button on the first render.
   */
  const [isFriend, setIsFriend] = React.useState<boolean>(true);

  /**
   * Controls the language creation modal's rendering
   */
  const [passwordChangeModalIsOpen, setPasswordChangeModalIsOpen] =
    React.useState(false);

  /**
   * Controls the language creation modal's rendering
   */
  const [newLanguageModalIsOpen, setNewLanguageModalIsOpen] =
    React.useState(false);

  /**
   * Is set whenever a language's delete button is selected. Holds the selected language's data
   */
  const [selectedDeleteLanguage, setSelectedDeleteLanguage] =
    React.useState<UserLanguage | null>(null);

  /**
   * Set the view as editable if the info's user's ID is the same as the user's. If not, check if the user is a friend
   * of the current user (i.e. has a friend chat with them).
   */
  React.useEffect(() => {
    const isCurrentUser = !!user?.id && user?.id === data?.id;
    setIsEditable(isCurrentUser);
    if (data && !isCurrentUser) {
      const isFriendOfCurrentUser = data?.friend_chats.some((chat) =>
        chat.users.some((chatUser) => chatUser.id === user?.id)
      );
      setIsFriend(isFriendOfCurrentUser);
    }
  }, [user, data]);

  /**
   * Language deletion handler
   */
  const { mutateAsync: deletionMutateAsync } = useDeleteUserLanguage();

  /**
   * Mutation which creates a chat with the user.
   */
  const { mutateAsync: creationMutateAsync } = useCreateChatWithUser(data);

  const handleDeleteLanguage = React.useCallback(async () => {
    if (selectedDeleteLanguage) {
      await deletionMutateAsync(selectedDeleteLanguage.url);
      setSelectedDeleteLanguage(null);
    }
  }, [deletionMutateAsync, selectedDeleteLanguage, setSelectedDeleteLanguage]);

  const joinWSChat = useJoinWSChat();

  /**
   * Click event handler to create chat.
   */
  const onClickChatCreate = React.useCallback(async () => {
    const response = await creationMutateAsync();
    const newChatId = response?.data?.id;
    if (response?.status === 201 && newChatId) {
      joinWSChat(newChatId);
      navigate(`/chats/${newChatId}`);
    }
  }, [creationMutateAsync, navigate, joinWSChat]);

  /**
   * Set header to render the title 'user info', plus a button to chat with the user if the user is not already a
   * friend of the current user (i.e. doesn't have any friend chats with them).
   */
  React.useEffect(() => {
    setHeader({
      title: "User info",
      actions: (
        <React.Fragment>
          {!isFriend ? (
            <button type="button" onClick={onClickChatCreate} css={infoButton}>
              Chat with user
            </button>
          ) : null}
          {isEditable ? (
            <button
              type="button"
              onClick={() => setPasswordChangeModalIsOpen(true)}
              css={infoButton}
            >
              Change password
            </button>
          ) : null}
        </React.Fragment>
      ),
    });
  }, [
    isFriend,
    setHeader,
    onClickChatCreate,
    isEditable,
    setPasswordChangeModalIsOpen,
  ]);

  return data ? (
    <React.Fragment>
      <animated.div css={container} style={transitionProps}>
        {/* Main user information
            Contains the user's picture, username, languages and description.
            */}
        <section css={infoSection}>
          {isEditable && data ? (
            <React.Fragment>
              <ImageInput
                image={data.image}
                defaultImage={defaultImg}
                url={data.url}
                invalidateQueryKey={["users", user?.id]}
              />
              <UserNameInput data={data} />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <img src={data.image ?? defaultImg} alt="" css={picture} />
              <p>{data?.username}</p>
            </React.Fragment>
          )}

          {/* Languages
                If the view is editable, contains controls for creating, editing and removing the user's languages.
                Else, it only displays the languages */}
          <section css={languagesOuterContainer}>
            <h3>Languages</h3>
            <div css={languagesInnerContainer}>
              {isEditable ? (
                <React.Fragment>
                  {/* Render selects for the user's non-native languages, as native languages can't be edited
                            by the user */}
                  {data.languages.map((language) =>
                    language.level === "NA" ? (
                      <LanguageBadge
                        language={language.language}
                        level={language.level}
                        bg={colors.DARK}
                        key={language.id}
                      />
                    ) : (
                      <div css={editableLanguage} key={language.id}>
                        <UserInfoEditLanguageBadge
                          data={language}
                          bg={colors.DARK}
                          onDelete={() => setSelectedDeleteLanguage(language)}
                        />
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => setNewLanguageModalIsOpen(true)}
                    css={infoButton}
                  >
                    Add
                    <Plus />
                  </button>
                </React.Fragment>
              ) : (
                data.languages.map((language) => (
                  <LanguageBadge
                    language={language.language}
                    level={language.level}
                    bg={colors.DARK}
                    key={language.id}
                  />
                ))
              )}
            </div>
          </section>

          <section css={descriptionSection}>
            {isEditable ? (
              <DescriptionTextarea data={data} queryKey={"users"} />
            ) : (
              <React.Fragment>
                <h3>Description</h3>
                <p>{data?.description}</p>
              </React.Fragment>
            )}
          </section>
        </section>

        {/* Friends */}
        <section css={listSection}>
          <h3 css={listSectionHeader}>Friends</h3>
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
          {!data?.friend_chats.length ? (
            <article css={emptyListContainer}>
              <p>
                {isEditable
                  ? "You have not added any friends yet."
                  : "This user has not added any friends yet."}
              </p>
            </article>
          ) : null}
        </section>

        {/* Channels*/}
        <section css={channelListContainer}>
          <h3 css={listSectionHeader}>Channels</h3>
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
          {!data?.memberships.length ? (
            <article css={emptyListContainer}>
              <p>
                {isEditable
                  ? "You have not joined any channels yet."
                  : "This user has not joined any channels yet."}
              </p>
            </article>
          ) : null}
        </section>
      </animated.div>

      {/* Language creation modal
          Only rendered if the profile is the session user's. Opens when the 'add a language' button is pressed. */}
      {isEditable ? (
        <NewLanguageModal
          isOpen={newLanguageModalIsOpen}
          setIsOpen={setNewLanguageModalIsOpen}
        />
      ) : null}

      {/* Language deletion modal
          Only rendered if the profile is the session user's and a language has been selected for deletion (i.e. when a
          language's delete button has been pressed.) */}
      {isEditable && selectedDeleteLanguage ? (
        <DeleteLanguageModal
          selectedDeleteLanguage={selectedDeleteLanguage}
          setSelectedDeleteLanguage={setSelectedDeleteLanguage}
          handleDeleteLanguage={handleDeleteLanguage}
        />
      ) : null}

      {/* Set password modal.
          Only rendered if the profile is the session user's. Opens when the 'change password' button is pressed. */}
      {isEditable ? (
        <SetPasswordModal
          isOpen={passwordChangeModalIsOpen}
          setIsOpen={setPasswordChangeModalIsOpen}
        />
      ) : null}
    </React.Fragment>
  ) : null;
}

const container = css`
  overflow-y: scroll;
`;

const picture = css`
  ${profileImg};
  grid-area: input;
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

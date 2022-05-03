/** @jsxImportSource @emotion/react */

import React from "react";
import useAuth from "../../auth/AuthContext";
import {UserLanguage} from "../../../entities/User";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import {css} from "@emotion/react";
import {descriptionSection, infoSection, listSection, listSectionHeader, profileImg} from "../styles";
import {UserNameInput} from "../components/NameInput";
import DescriptionTextarea from "../components/DescriptionTextarea";
import InfoListElement from "../components/InfoListElement";
import ReactModal from "react-modal";
import UserInfoNewLanguageSelect from "./UserInfoNewLanguageSelect";
import {colors, textSizes} from "../../../styles/variables";
import {Plus} from "iconoir-react";
import Button, {buttonWithoutBackgroundAndBorder} from "../../../components/Button";
import LanguageBadge from "../../../components/LanguageBadge";
import UserInfoEditLanguageBadge from "./UserInfoEditLanguageBadge";
import {languages} from "../../../resources/languages";
import ImageInput from "../components/ImageInput";
import {getFriendFromFriendChat} from "../../chats/hooks";
import {ChatHeaderProps} from "../../../components/ChatHeader";
import {modal} from "../../../styles/components";
import {useCreateChatWithUser, useDeleteUserLanguage, useUser} from "./hooks";

const defaultImg = require("../../../static/images/user_placeholder.png");

// Set the modal's app element to "hide the application from assistive screenreaders and other assistive technologies
// while the modal is open" (see react-modal docs: https://reactcommunity.org/react-modal/examples/set_app_element/).
ReactModal.setAppElement("#root");


export function UserInfo() {
    /**
     * Generic user info component. Is used by the OwnUserInfo and OtherUserInfo components, from which it receives the
     * user's data and whether the information is editable by the user.
     */

    const params = useParams();
    const {user} = useAuth();
    const navigate = useNavigate();
    const [, setHeader] = useOutletContext<[ChatHeaderProps | null, React.Dispatch<React.SetStateAction<ChatHeaderProps | null>>]>();

    /**
     * Holds the user's data
     */
    const {data} = useUser(params.id);

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
    const [newLanguageModalIsOpen, setNewLanguageModalIsOpen] = React.useState(false);

    /**
     * Is set whenever a language's delete button is selected. Holds the selected language's data
     */
    const [selectedDeleteLanguage, setSelectedDeleteLanguage] = React.useState<UserLanguage | null>(null);

    /**
     * Set the view as editable if the info's user's ID is the same as the user's. If not, check if the user is a friend
     * of the current user (i.e. has a friend chat with them).
     */
    React.useEffect(() => {
        const isCurrentUser = !!user?.id && (user?.id === data?.id);
        setIsEditable(isCurrentUser);
        if (data && !isCurrentUser) {
            const isFriendOfCurrentUser = data?.friend_chats.some(chat =>
                chat.users.some(chatUser =>
                    chatUser.id === user?.id));
            setIsFriend(isFriendOfCurrentUser);
        }
    }, [user, data]);

    /**
     * Language deletion handler
     */
    const handleDeleteLanguage = useDeleteUserLanguage(selectedDeleteLanguage, setSelectedDeleteLanguage);

    /**
     * Handler which creates a chat with the user.
     */
    const handleCreateChatWithUser = useCreateChatWithUser(data);

    /**
     * Click event handler to create chat.
     */
    const onClickChatCreate = React.useCallback(async () => {
        const response = await handleCreateChatWithUser();
        navigate(`/chats/${response?.data?.id}`);
    },[]);

    /**
     * Set header to render the title 'user info', plus a button to chat with the user if the user is not already a
     * friend of the current user (i.e. doesn't have any friend chats with them).
     */
    React.useEffect(() => {
        setHeader({
            title: "User info",
            actions:
                <React.Fragment>
                    {!isFriend ?
                        <button type="button" onClick={onClickChatCreate}
                                css={css`${buttonWithoutBackgroundAndBorder};
                                  font-size: ${textSizes.S};
                                  color: white;
                                `}>
                            Chat with user
                        </button> : null}
                </React.Fragment>
        });
    }, [data?.id, isFriend, navigate, setHeader, onClickChatCreate]);


    return data ? <React.Fragment>
        <div css={css`
          overflow-y: scroll;
        `}>
            {/* Main user information
            Contains the user's picture, username, languages and description.
            */}
            <section css={infoSection}>
                {isEditable && data ?
                    <React.Fragment>
                        <ImageInput image={data.image} defaultImage={defaultImg}
                                    url={data.url} invalidateQueryKey={["users", user?.id]}/>
                        <UserNameInput data={data}/>
                    </React.Fragment> :
                    <React.Fragment>
                        <img src={data.image ?? defaultImg} alt="" css={css`${profileImg};
                          grid-area: input;
                        `}/>
                        <p>{data?.username}</p>
                    </React.Fragment>
                }

                {/* Languages
                If the view is editable, contains controls for creating, editing and removing the user's languages.
                Else, it only displays the languages */}
                <section css={css`
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  gap: 0.5rem;
                `}>
                    <h3>Languages</h3>
                    <div css={css`
                      display: flex;
                      flex-wrap: wrap;
                      gap: 0.5rem;
                    `}>
                        {isEditable ?
                            <React.Fragment>
                                {/* Render selects for the user's non-native languages, as native languages can't be edited
                            by the user */}
                                {data.languages.map(language => language.level === "NA" ?
                                    <LanguageBadge language={language.language} level={language.level} bg={colors.DARK}
                                                   key={language.id}/> :
                                    <div css={css`
                                      display: flex;
                                      align-items: center;
                                      gap: 1rem;
                                    `} key={language.id}>
                                        <UserInfoEditLanguageBadge data={language} bg={colors.DARK}
                                                                   onDelete={() => setSelectedDeleteLanguage(language)}/>
                                    </div>
                                )}
                                <button type="button"
                                        onClick={() => setNewLanguageModalIsOpen(true)}
                                        css={css`${buttonWithoutBackgroundAndBorder};
                                          color: ${colors.WHITE}
                                        `}>
                                    Add<Plus/>
                                </button>
                            </React.Fragment> :
                            data.languages.map(language =>
                                <LanguageBadge language={language.language} level={language.level} bg={colors.DARK}
                                               key={language.id}/>
                            )
                        }
                    </div>
                </section>

                <section css={descriptionSection}>
                    {isEditable ?
                        <DescriptionTextarea data={data} queryKey={"users"}/> :
                        <React.Fragment>
                            <h3>Description</h3>
                            <p>{data?.description}</p>
                        </React.Fragment>
                    }
                </section>
            </section>

            {/* Friends */}
            <section css={listSection}>
                <h3 css={listSectionHeader}>Friends</h3>
                {data?.friend_chats.map(chat => {
                        const friend = getFriendFromFriendChat(data, chat);
                        if (friend) {
                            return <InfoListElement name={friend.username}
                                                    description={friend.description}
                                                    key={friend.id}
                                                    image={friend.image}
                                                    link={`/chats/users/${friend.id}`}
                            />;
                        }
                        return null;
                    }
                )}
                {/* Empty list */}
                {!data?.friend_chats.length ?
                    <article css={css`
                      padding: 0.5rem 1rem;
                    `}>
                        <p>{isEditable ? "You have not added any friends yet." :
                            "This user has not added any friends yet."}</p>
                    </article>
                    : null}
            </section>

            {/* Channels*/}
            <section css={css`${listSection};
              padding-top: 0;
            `}>
                <h3 css={listSectionHeader}>Channels</h3>
                {data?.memberships.map(membership =>
                    <InfoListElement name={membership.channel.name}
                                     description={membership.channel.description}
                                     additionalInfo={membership.role === "A" ? "Admin" : undefined}
                                     key={membership.id}
                                     image={membership.channel.image}
                                     link={`/chats/channels/${membership.channel.id}`}
                    />
                )}
                {/* Empty list */}
                {!data?.memberships.length ?
                    <article css={css`
                      padding: 0.5rem 1rem;
                    `}>
                        <p>{isEditable ? "You have not joined any channels yet." :
                            "This user has not joined any channels yet."}</p>
                    </article>
                    : null}
            </section>
        </div>

        {/* Language creation modal
        Only rendered if the profile is the current user's. Opens when the 'add a language' button is pressed. */}
        {isEditable ?
            <ReactModal
                isOpen={newLanguageModalIsOpen}
                onRequestClose={() => setNewLanguageModalIsOpen(false)}
                contentLabel="Add a new language"
                style={modal}
            >
                <p css={css`
                  margin-bottom: 1rem;
                  color: ${colors.DARK};
                `}>Add a new language</p>
                <UserInfoNewLanguageSelect onClose={() => setNewLanguageModalIsOpen(false)}/>
            </ReactModal> :
            null
        }

        {/* Language deletion modal
        Only rendered if the profile is the current user's and a language has been selected for deletion (i.e. when a
        language's delete button has been pressed.) */}
        {isEditable && selectedDeleteLanguage ?
            <ReactModal
                isOpen={!!selectedDeleteLanguage}
                onRequestClose={() => setSelectedDeleteLanguage(null)}
                contentLabel="Delete language"
                style={modal}
            >
                <p css={css`
                  margin-bottom: 1rem;
                  color: ${colors.DARK};
                `}>Delete {languages.find(l => l.key === selectedDeleteLanguage.language)?.value} from your
                    languages?</p>
                <div css={css`
                  display: flex;
                  gap: 1rem;
                `}>
                    <Button visible={true} onClick={handleDeleteLanguage}>
                        Delete
                    </Button>
                    <Button visible={true} onClick={() => setSelectedDeleteLanguage(null)}>
                        Cancel
                    </Button>
                </div>
            </ReactModal> :
            null
        }
    </React.Fragment> : null;
}

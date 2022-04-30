/** @jsxImportSource @emotion/react */

import React from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import useAuth, {axiosApi} from "../../auth/AuthContext";
import {User, UserLanguage} from "../../../entities/User";
import {useOutletContext, useParams} from "react-router-dom";
import {css} from "@emotion/react";
import {descriptionSection, infoSection, listSection, listSectionHeader, profileImg} from "../styles";
import {UserNameInput} from "../components/NameInput";
import DescriptionTextarea from "../components/DescriptionTextarea";
import InfoListElement from "../channel/InfoListElement";
import ReactModal from "react-modal";
import UserInfoNewLanguageSelect from "./UserInfoNewLanguageSelect";
import {colors} from "../../../styles/variables";
import {Plus} from "iconoir-react";
import Button from "../../../components/Button";
import LanguageBadge from "../../../components/LanguageBadge";
import UserInfoEditLanguageBadge from "./UserInfoEditLanguageBadge";
import {languages} from "../../../resources/languages";
import ImageInput from "../components/ImageInput";
import {getFriendFromFriendChat} from "../../chats/hooks";
import {ChatHeaderProps} from "../../../components/ChatHeader";

const defaultImg = require("../../../static/images/user_placeholder.png");

// Set the modal's app element to "hide the application from assistive screenreaders and other assistive technologies
// while the modal is open" (see react-modal docs: https://reactcommunity.org/react-modal/examples/set_app_element/).
ReactModal.setAppElement("#root");

const modalStyles = {
    content: {
        margin: "auto",
        width: "fit-content",
        height: "fit-content",
        overflow: "visible",
        padding: "1.25rem",
    },
    overlay: {
        zIndex: 100
    }
};


export function UserInfo() {
    /**
     * Generic user info component. Is used by the OwnUserInfo and OtherUserInfo components, from which it receives the
     * user's data and whether the information is editable by the user.
     */

    const queryClient = useQueryClient();
    const params = useParams();
    const {user} = useAuth();
    const [, setHeader] = useOutletContext<[ChatHeaderProps | null, React.Dispatch<React.SetStateAction<ChatHeaderProps | null>>]>();

    /**
     * Set header to only render the title 'user info'
     */
    React.useEffect(() => {
        setHeader({
            title: "User info"
        });
    }, [setHeader]);

    /**
     * Holds the users's data
     */
    const {data} = useQuery<User>(["users", params.id], async () => {
        const response = await axiosApi.get(`/users/${params.id}`);
        return response.data;
    }, {
        staleTime: 15000,
        enabled: !!params.id
    });

    /**
     * Controls whether the info is editable (i.e. if edit controls are displayed)
     */
    const [isEditable, setIsEditable] = React.useState<boolean>(false);

    /**
     * Controls the language creation modal's rendering
     */
    const [newLanguageModalIsOpen, setNewLanguageModalIsOpen] = React.useState(false);

    /**
     * Is set whenever a language's delete button is selected. Holds the selected language's data
     */
    const [selectedDeleteLanguage, setSelectedDeleteLanguage] = React.useState<UserLanguage | null>(null);

    /**
     * Set the view as editable if the info's user's ID is the same as the user's
     */
    React.useEffect(() => setIsEditable(!!user?.id && (user?.id === data?.id)), [user, data]);

    /**
     * Delete-related functions
     */
    const deleteRequest = async (url: string) => {
        const response = await axiosApi.delete(url);
        return response.data;
    };

    const deleteMutation = useMutation(deleteRequest, {
        onSuccess: async () => {
            await queryClient.invalidateQueries<User | undefined>(["users", user?.id]);
        }
    });

    const handleDelete = async () => {
        if (selectedDeleteLanguage) {
            await deleteMutation.mutateAsync(selectedDeleteLanguage.url);
            setSelectedDeleteLanguage(null);
        }
    };


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
                                        css={css`
                                          background: none;
                                          color: ${colors.WHITE};
                                          border: none;
                                          display: flex;
                                          align-items: center;
                                        `}
                                >
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
                style={modalStyles}
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
                style={modalStyles}
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
                    <Button visible={true} onClick={handleDelete}>
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

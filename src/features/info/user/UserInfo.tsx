/** @jsxImportSource @emotion/react */

import React from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import useAuth, {axiosApi} from "../../auth/AuthContext";
import {chatRoomCss, chatRoomCssMobile} from "../../chats/room/styles";
import ChatRoomHeader from "../../chats/room/ChatRoomHeader";
import {useMediaQuery} from "react-responsive";
import {User, UserLanguage} from "../../../entities/User";
import {useMatch} from "react-router-dom";
import ProfileInfoHeader from "./ProfileInfoHeader";
import {css} from "@emotion/react";
import {descriptionSection, infoSection, listSection, profileImg} from "../styles";
import {UserNameInput} from "../components/NameInput";
import DescriptionTextarea from "../components/DescriptionTextarea";
import InfoListElement from "../channel/InfoListElement";
import ReactModal from "react-modal";
import UserInfoNewLanguageSelect from "./UserInfoNewLanguageSelect";
import {colors} from "../../../styles/variables";
import {Plus} from "iconoir-react";
import {buttonWithoutBackgroundAndBorder} from "../../../components/EditButton/EditButton";
import LanguageBadge from "../../../components/LanguageBadge/LanguageBadge";
import UserInfoEditLanguageBadge from "./UserInfoEditLanguageBadge";
import {languages} from "../../../resources/languages";
import ImageInput from "../components/ImageInput";

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
    }
};


function UserInfo({data, editable}: { data: User, editable: boolean }) {
    // Generic user info component. Is used by the OwnUserInfo and OtherUserInfo components, from which it receives the
    // user's data and whether the information is editable by the user.

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});
    const isUserProfile = useMatch("/chats/profile");
    const queryClient = useQueryClient();

    // State hook which controls the language creation modal
    const [newLanguageModalIsOpen, setNewLanguageModalIsOpen] = React.useState(false);
    // Is set whenever a language's delete button is selected. Holds the selected language's data
    const [selectedDeleteLanguage, setSelectedDeleteLanguage] = React.useState<UserLanguage | null>(null);


    const deleteRequest = async (url: string) => {
        const response = await axiosApi.delete(url);
        return response.data;
    };

    const deleteMutation = useMutation(deleteRequest, {
        onSuccess: async () => {
            await queryClient.invalidateQueries<User | undefined>(["users", "me"]);
        }
    });

    return <React.Fragment>
        <div css={css`${isDesktop ? chatRoomCss : chatRoomCssMobile};
          overflow-y: scroll;
        `}>
            {/* Header
            Doesn't render in mobile layout, as it's rendered in the main header instead. */}
            {isDesktop ?
                isUserProfile ?
                    <ProfileInfoHeader/> :
                    <ChatRoomHeader id={data.id}/> :
                null
            }

            {/* Main user information
            Contains the user's picture, username, languages and description.
            */}
            <section css={infoSection}>
                {editable && data ?
                    <React.Fragment>
                        <ImageInput image={data.image} defaultImage={defaultImg}
                                    url={data.url} invalidateQueryKey={["users", "me"]}/>
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
                        {editable ?
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
                    {editable ?
                        <DescriptionTextarea data={data}/> :
                        <React.Fragment>
                            <h3>Description</h3>
                            <p>{data?.description}</p>
                        </React.Fragment>
                    }
                </section>
            </section>

            {/* Friends */}
            <section css={listSection}>
                <h3>Friends</h3>
                {data?.friends.map(friend =>
                    <InfoListElement name={friend.username}
                                     description={friend.description}
                                     key={friend.id}
                                     image={friend.image}
                    />
                )}
            </section>

            {/* Channels*/}
            <section css={listSection}>
                <h3>Channels</h3>
                {data?.memberships.map(membership =>
                    <InfoListElement name={membership.channel.name}
                                     description={membership.channel.description}
                                     additionalInfo={membership.role === "A" ? "Admin" : undefined}
                                     key={membership.id}
                                     image={membership.channel.image}
                    />
                )}
            </section>
        </div>

        {/* Language creation modal
        Only rendered if the profile is the current user's. Opens when the 'add a language' button is pressed. */}
        {editable ?
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
        {editable && selectedDeleteLanguage ?
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
                    <button onClick={async () => {
                        await deleteMutation.mutateAsync(selectedDeleteLanguage.url);
                        setSelectedDeleteLanguage(null);
                    }}
                            css={buttonWithoutBackgroundAndBorder}>
                        Delete
                    </button>
                    <button onClick={() => setSelectedDeleteLanguage(null)}
                            css={buttonWithoutBackgroundAndBorder}>
                        Cancel
                    </button>
                </div>
            </ReactModal> :
            null
        }
    </React.Fragment>;
}

export function OwnUserInfo() {
    // User detail component for the current user. Editable.
    const {user} = useAuth();
    return user ? <UserInfo data={user} editable={true}/> : null;
}

export function OtherUserInfo({id, url}: { id: string, url: string }) {
    // User detail component for users other than the current user. Non-editable.
    const {data} = useQuery<User>(["chats", "info", id], async () => {
        const response = await axiosApi.get(url);
        return response.data;
    }, {
        staleTime: 15000,
    });
    return data ? <UserInfo data={data} editable={false}/> : null;
}

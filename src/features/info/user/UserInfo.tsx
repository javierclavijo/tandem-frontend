/** @jsxImportSource @emotion/react */

import React from "react";
import {useQuery} from "react-query";
import useAuth, {axiosApi} from "../../auth/AuthContext";
import {chatRoomCss, chatRoomCssMobile} from "../../chats/room/styles";
import ChatRoomHeader from "../../chats/room/ChatRoomHeader";
import {useMediaQuery} from "react-responsive";
import {User} from "../../../entities/User";
import {useMatch} from "react-router-dom";
import ProfileInfoHeader from "./ProfileInfoHeader";
import {css} from "@emotion/react";
import {descriptionSection, infoSection, listSection, profileImg} from "../channel/styles";
import {UserNameInput} from "../components/NameInput";
import DescriptionTextarea from "../components/DescriptionTextarea";
import InfoListElement from "../channel/InfoListElement";
import UserInfoEditLanguageSelect from "./UserInfoEditLanguageSelect";
import ReactModal from "react-modal";
import UserInfoNewLanguageSelect from "./UserInfoNewLanguageSelect";
import {colors} from "../../../styles/variables";
import {Plus} from "iconoir-react";

const placeholderImg = require("../../../static/images/user_placeholder.png");

ReactModal.setAppElement("#root");

function UserInfo({data, editable}: { data: User, editable: boolean }) {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});
    const isUserProfile = useMatch("/chats/profile");

    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return <React.Fragment>
        <div css={css`${isDesktop ? chatRoomCss : chatRoomCssMobile};
          overflow-y: scroll;
        `}>
            {isDesktop ?
                isUserProfile ?
                    <ProfileInfoHeader/> :
                    <ChatRoomHeader id={data.id}/> :
                null
            }
            <section css={infoSection}>
                <img src={placeholderImg} alt="" css={profileImg}/>
                {editable && data ?
                    <UserNameInput data={data}/> :
                    <p>{data?.username}</p>
                }
                <p css={css`
                  display: flex;
                  gap: 0.5rem;
                `}>
                    {data.languages.map(language =>
                        <span key={language.id}>{language.language} · {language.level}</span>
                    )}
                </p>
                <section css={descriptionSection}>
                    {editable ?
                        <DescriptionTextarea data={data}/> :
                        <React.Fragment>
                            <h3>Description</h3>
                            <p>{data?.description}</p>
                        </React.Fragment>
                    }
                </section>
                {editable ?
                    <section css={css`
                      width: 100%;
                      display: flex;
                      flex-direction: column;
                      align-items: flex-start;
                      gap: 0.5rem;
                    `}>
                        <React.Fragment>
                            <h3>Languages</h3>
                            {data.languages.map(language => {
                                    if (language.level !== "NA") {
                                        return <UserInfoEditLanguageSelect data={language} key={language.id}/>;
                                    } else {
                                        return <span key={language.id}>{language.language} · {language.level}</span>;
                                    }
                                }
                            )}
                            <button type="button"
                                    onClick={() => setModalIsOpen(true)}
                                    css={css`
                                      background: none;
                                      color: ${colors.WHITE};
                                      border: none;
                                      display: flex;
                                      align-items: center;
                                    `}
                            >
                                Add a language <Plus/>
                            </button>
                        </React.Fragment>
                    </section> : null
                }
            </section>
            <section css={listSection}>
                <h3>Friends</h3>
                {data?.friends.map(friend =>
                    <InfoListElement name={friend.username}
                                     description={friend.description}
                                     key={friend.id}
                    />
                )}
            </section>
            <section css={listSection}>
                <h3>Channels</h3>
                {data?.memberships.map(membership =>
                    <InfoListElement name={membership.channel.name}
                                     description={membership.channel.description}
                                     additionalInfo={membership.role === "A" ? "Admin" : undefined}
                                     key={membership.id}
                    />
                )}
            </section>
        </div>
        <ReactModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Add a new language"
            style={{
                content: {
                    margin: "auto",
                    width: "fit-content",
                    height: "fit-content",
                    overflow: "visible",
                    padding: "1.25rem",
                }
            }}
        >
            <p css={css`
              margin-bottom: 1rem;
              color: ${colors.DARK};
            `}>Add a new language</p>
            <UserInfoNewLanguageSelect onClose={closeModal}/>
        </ReactModal>
    </React.Fragment>
        ;
}

export function OwnUserInfo() {

    const {user} = useAuth();

    return user ? <UserInfo data={user} editable={true}/> : null;
}

export function OtherUserInfo({id, url}: { id: string, url: string }) {

    const {data} = useQuery<User>(["chats", "info", id], async () => {
        const response = await axiosApi.get(url);
        return response.data;
    }, {
        staleTime: 15000,
    });

    return data ? <UserInfo data={data} editable={false}/> : null;
}

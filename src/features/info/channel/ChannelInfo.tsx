/** @jsxImportSource @emotion/react */

import React, {useState} from "react";
import {Chat} from "../../../entities/Chat";
import {chatRoomCss, chatRoomCssMobile} from "../../chats/room/styles";
import ChatRoomHeader from "../../chats/room/ChatRoomHeader";
import {useMediaQuery} from "react-responsive";
import {useMutation, useQuery} from "react-query";
import {Channel} from "../../../entities/Channel";
import useAuth, {axiosApi} from "../../auth/AuthContext";
import {css} from "@emotion/react";
import DescriptionTextarea from "../components/DescriptionTextarea";
import {descriptionSection, infoSection, languageItem, languageSection, listSection, profileImg} from "./styles";
import InfoListElement from "./InfoListElement";
import {ChannelNameInput} from "../components/NameInput";
import InfoSelect, {languageOptions, levelOptions, Option} from "../components/InfoSelect";

const placeholderImg = require("../../../static/images/user_placeholder.png");


function ChannelInfo({chat}: { chat: Chat }) {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});
    const {user} = useAuth();
    const {data} = useQuery<Channel>(["chats", "info", chat.id], async () => {
        const response = await axiosApi.get(chat.info_url);
        return response.data;
    }, {
        staleTime: 15000,
    });


    const [editable, setEditable] = useState<boolean>(false);

    React.useEffect(() => setEditable(
        // Check if the user has admin role, set the 'editable' state accordingly
        !!data?.memberships.some(membership =>
            membership.user?.id === user?.id && membership.role === "A"
        )), [data?.memberships, user]);


    const languageUpdateRequest = React.useCallback(async (requestData: { language: string }) => {
        if (data) {
            const response = await axiosApi.patch(data?.url, requestData);
            return response.data;
        }
    }, [data]);

    const languageUpdateMutation = useMutation(languageUpdateRequest, {
        onSuccess: async (data) => {
        }
    });

    const handleLanguageChange = async (option: Option) => {
        const requestData = {language: option.value};
        await languageUpdateMutation.mutateAsync(requestData);
    };

    return (
        <div css={css`${isDesktop ? chatRoomCss : chatRoomCssMobile};
          overflow-y: scroll;
        `}>
            {isDesktop ?
                <ChatRoomHeader id={data?.id as string}/> :
                null}
            <section css={infoSection}>
                <img src={placeholderImg} alt="" css={profileImg}/>
                {editable && data ?
                    <ChannelNameInput data={data}/> :
                    <p>{data?.name}</p>
                }
                <p>Channel [{data?.language}][{data?.level}] · {data?.memberships.length} members</p>
                <section css={descriptionSection}>
                    {editable && data ?
                        <DescriptionTextarea data={data}/> :
                        <React.Fragment>
                            <h3>Description</h3>
                            <p>{data?.description}</p>
                        </React.Fragment>
                    }
                </section>
                {editable && data ?
                    <section css={languageSection}>

                        <div css={languageItem}>
                            <label htmlFor="language">Language</label>
                            <InfoSelect id="language"
                                        initialValue={data.language}
                                        options={languageOptions}
                                        handleSubmit={handleLanguageChange}
                            />
                        </div>
                        <div css={languageItem}>
                            <label htmlFor="level">Level</label>
                            <InfoSelect id="level"
                                        initialValue={data.level}
                                        options={levelOptions}
                                        handleSubmit={handleLanguageChange}
                            />
                        </div>
                    </section> :
                    null
                }
            </section>
            <section css={listSection}>
                <h3>Members</h3>
                {data?.memberships.map(membership =>
                    membership.user ?
                        <InfoListElement name={membership.user?.username}
                                         additionalInfo={membership.role === "A" ? "Admin" : undefined}
                                         description={membership.user.description}
                                         key={membership.url}
                        />
                        : null
                )}
            </section>
            ;
        </div>
    )
        ;
}

export default ChannelInfo;

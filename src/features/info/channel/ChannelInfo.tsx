/** @jsxImportSource @emotion/react */

import React, {useState} from "react";
import {useQuery} from "react-query";
import {Channel} from "../../../entities/Channel";
import useAuth, {axiosApi} from "../../auth/AuthContext";
import {css} from "@emotion/react";
import DescriptionTextarea from "../components/DescriptionTextarea";
import {descriptionSection, infoSection, listSection, listSectionHeader, profileImg} from "../styles";
import InfoListElement from "./InfoListElement";
import {ChannelNameInput} from "../components/NameInput";
import LanguageBadge from "../../../components/LanguageBadge";
import {colors} from "../../../styles/variables";
import ChannelEditLanguageBadge from "./ChannelEditLanguageBadge";
import ImageInput from "../components/ImageInput";
import {useOutletContext, useParams} from "react-router-dom";
import {ChatHeaderProps} from "../../../components/ChatHeader";

const defaultImg = require("../../../static/images/user_placeholder.png");


function ChannelInfo() {

    const params = useParams();
    const {user} = useAuth();
    const [, setHeader] = useOutletContext<[ChatHeaderProps | null, React.Dispatch<React.SetStateAction<ChatHeaderProps | null>>]>();

    /**
     * Set header to only render the title 'user info'
     */
    React.useEffect(() => {
        setHeader({
            title: "Channel info"
        });
    }, [setHeader]);

    // Holds the channel's data
    const {data} = useQuery<Channel>(["channels", params.id], async () => {
        const response = await axiosApi.get(`/channels/${params.id}`);
        return response.data;
    }, {
        staleTime: 15000,
        enabled: !!params.id
    });


    const [editable, setEditable] = useState<boolean>(false);

    React.useEffect(() => setEditable(
        // Check if the user has admin role, set the 'editable' state accordingly
        !!data?.memberships.some(membership =>
            membership.user?.id === user?.id && membership.role === "A"
        )), [data?.memberships, user]);


    return data ?
        <div css={css`
          overflow-y: scroll;
        `}>
            <section css={infoSection}>
                {editable && data ?
                    <React.Fragment>
                        <ImageInput image={data.image} defaultImage={defaultImg}
                                    url={data.url} invalidateQueryKey={["channels", data.id]}/>
                        <ChannelNameInput data={data}/>
                    </React.Fragment> :
                    <React.Fragment>
                        <img src={data.image ?? defaultImg} alt="" css={profileImg}/>
                        <p>{data?.name}</p>
                    </React.Fragment>
                }
                <p>Channel · {data?.memberships.length} members</p>
                {editable ?
                    <ChannelEditLanguageBadge data={data} bg={colors.DARK}/> :
                    <LanguageBadge language={data.language} level={data.level} bg={colors.DARK}/>
                }
                <section css={descriptionSection}>
                    {editable && data ?
                        <DescriptionTextarea data={data} queryKey={"channels"}/> :
                        <React.Fragment>
                            <h3>Description</h3>
                            <p>{data?.description}</p>
                        </React.Fragment>
                    }
                </section>
            </section>
            <section css={listSection}>
                <h3 css={listSectionHeader}>
                    Members
                </h3>
                {data?.memberships.map(membership =>
                    membership.user ?
                        <InfoListElement name={membership.user?.username}
                                         additionalInfo={membership.role === "A" ? "Admin" : undefined}
                                         description={membership.user.description}
                                         key={membership.url}
                                         image={membership.user.image}
                                         link={`/chats/users/${membership.user.id}`}
                        />
                        : null
                )}
                {/* Empty list */}
                {!data?.memberships.length ?
                    <article css={css`
                      padding: 0.5rem 1rem;
                    `}>
                        <p>This channel doesn't have any members yet.</p>
                    </article>
                    : null}
            </section>
        </div> : null;
}

export default ChannelInfo;

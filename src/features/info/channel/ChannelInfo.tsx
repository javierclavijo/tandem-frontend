/** @jsxImportSource @emotion/react */

import React, {useState} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {Channel} from "../../../entities/Channel";
import useAuth, {axiosApi} from "../../auth/AuthContext";
import {css} from "@emotion/react";
import DescriptionTextarea from "../components/DescriptionTextarea";
import {descriptionSection, infoSection, listSection, listSectionHeader, profileImg} from "../styles";
import InfoListElement from "./InfoListElement";
import {ChannelNameInput} from "../components/NameInput";
import LanguageBadge from "../../../components/LanguageBadge";
import {colors, textSizes} from "../../../styles/variables";
import ChannelEditLanguageBadge from "./ChannelEditLanguageBadge";
import ImageInput from "../components/ImageInput";
import {useLocation, useNavigate, useOutletContext, useParams} from "react-router-dom";
import {ChatHeaderProps} from "../../../components/ChatHeader";
import Button, {buttonWithoutBackgroundAndBorder} from "../../../components/Button";
import {FastArrowDownBox, FastArrowUpBox} from "iconoir-react";
import ShareLink from "../../../components/ShareLink";
import {modal, modalButton} from "../../../styles/components";
import ReactModal from "react-modal";

const defaultImg = require("../../../static/images/user_placeholder.png");

// Set the modal's app element to "hide the application from assistive screenreaders and other assistive technologies
// while the modal is open" (see react-modal docs: https://reactcommunity.org/react-modal/examples/set_app_element/).
ReactModal.setAppElement("#root");

function ChannelInfo() {
    /**
     * Displays a channel's details: image, name, language and level, description and members.
     */

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const params = useParams();
    const {user} = useAuth();
    const location = useLocation();
    const [, setHeader] = useOutletContext<[ChatHeaderProps | null, React.Dispatch<React.SetStateAction<ChatHeaderProps | null>>]>();

    /**
     * Controls whether the channel is editable by the user.
     */
    const [editable, setEditable] = useState<boolean>(false);

    /**
     * Controls whether the channel deletion confirmation modal is open.
     */
    const [deletionModalIsOpen, setDeletionModalIsOpen] = React.useState<boolean>(false);

    /**
     * Query which fetches and holds the channel's data
     */
    const {data} = useQuery<Channel>(["channels", params.id], async () => {
        const response = await axiosApi.get(`/channels/${params.id}`);
        return response.data;
    }, {
        staleTime: 15000,
        enabled: !!params.id
    });

    /**
     * Sets the header to render the title 'user info', plus a 'share' button which copies the channel's URL to the
     * clipboard on click.
     */
    React.useEffect(() => {
        setHeader({
            title: "Channel info",
            actions:
                <div css={css`
                  display: flex;
                  gap: 1rem;
                `}>
                    {editable ?
                        <button onClick={() => setDeletionModalIsOpen(true)} css={css`
                          ${buttonWithoutBackgroundAndBorder};
                          font-size: ${textSizes.S};
                          color: white;
                        `}>
                            Delete
                        </button> : null}
                    <ShareLink link={window.location.href}/>
                </div>
        });
    }, [editable, location.pathname, setHeader]);

    /**
     * Checks if the user has admin role, then sets the 'editable' state if applicable.
     */
    React.useEffect(() => setEditable(
        !!data?.memberships.some(membership =>
            membership.user?.id === user?.id && membership.role === "A"
        )), [data?.memberships, user]);

    /**
     * Deletes the channel.
     */
    const deleteChannelRequest = async () => {
        if (data) {
            return await axiosApi.delete(data?.url);
        }
    };

    /**
     * Sends the request to delete the channel.
     */
    const deleteChannelMutation = useMutation(deleteChannelRequest, {
        onSuccess: () => queryClient.invalidateQueries(["chats", "list"])
    });

    /**
     * Handles deletion, sending the deletion request and navigating back to the chat list.
     */
    const onDeleteClick = async () => {
        await deleteChannelMutation.mutateAsync();
        navigate("/chats/");
    };

    /**
     * Request function to promote users to moderators or demote them to regular users.
     */
    const updateMembershipRequest = async (args: { url: string, role: string }) => {
        const response = await axiosApi.patch(args.url, {role: args.role});
        return response.data;
    };

    /**
     * Mutation to promote/demote users. Invalidates the channel detail query on success.
     */
    const updateMembershipMutation = useMutation(updateMembershipRequest, {
        onSuccess: async () => {
            await queryClient.invalidateQueries<Channel>(["channels", params.id]);
        }
    });

    /**
     * Executes the mutation to promote users to moderators.
     * @param url The URL for the user's membership.
     */
    const demoteUser = async (url: string) => await updateMembershipMutation.mutateAsync({url, role: "U"});

    /**
     * Executes the mutation to demote moderators to regular users.
     * @param url The URL for the user's membership.
     */
    const promoteUser = async (url: string) => await updateMembershipMutation.mutateAsync({url, role: "M"});


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
                <p>Channel ·&nbsp;
                    {data?.memberships.length} {data?.memberships.length === 1 ? "member" : "members"}
                </p>
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
                                         additionalInfo={membership.role === "A" ? "Admin" :
                                             membership.role === "M" ? "Moderator" : undefined}
                                         description={membership.user.description}
                                         key={membership.url}
                                         image={membership.user.image}
                                         link={`/chats/users/${membership.user.id}`}
                                         buttons={
                                             <React.Fragment>
                                                 {/* If the user is a regular user, show a button to promote them to
                                                 moderator. If they are a moderator, show a button to demote them to
                                                 regular user. If they are admin, show nothing. */}
                                                 {membership.role === "U" ?
                                                     <Button visible={true}
                                                             onClick={async () => await promoteUser(membership.url)}>
                                                         Promote
                                                         <FastArrowUpBox color={colors.PRIMARY} height={"1.5rem"}
                                                                         width={"1.5rem"}/>
                                                     </Button> :
                                                     membership.role === "M" ?
                                                         <Button visible={true}
                                                                 onClick={async () => await demoteUser(membership.url)}>
                                                             Demote
                                                             <FastArrowDownBox color={colors.PRIMARY} height={"1.5rem"}
                                                                               width={"1.5rem"}/>
                                                         </Button> : null}
                                             </React.Fragment>
                                         }
                        /> : null)}
                {/* Empty list */}
                {!data?.memberships.length ?
                    <article css={css`
                      padding: 0.5rem 1rem;
                    `}>
                        <p>This channel doesn't have any members yet.</p>
                    </article>
                    : null}
            </section>

            {/* Channel deletion confirmation modal */}
            <ReactModal
                isOpen={deletionModalIsOpen}
                onRequestClose={() => setDeletionModalIsOpen(false)}
                contentLabel="Delete channel"
                style={modal}
            >
                <p css={css`
                  margin-bottom: 1rem;
                `}>
                    Delete channel?</p>
                <div css={css`
                  display: flex;
                  gap: 1rem;
                `}>
                    <button onClick={onDeleteClick}
                            css={modalButton}>
                        Delete
                    </button>
                    <button onClick={() => setDeletionModalIsOpen(false)}
                            css={css`${modalButton};
                              background-color: ${colors.DARK}60;
                            `}>
                        Cancel
                    </button>
                </div>
            </ReactModal>
        </div> : null;
}

export default ChannelInfo;

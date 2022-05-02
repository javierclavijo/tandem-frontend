import {useMutation, useQuery, useQueryClient} from "react-query";
import {Channel} from "../../../entities/Channel";
import {axiosApi} from "../../auth/AuthContext";
import {useNavigate} from "react-router-dom";
import React, {useCallback, useMemo} from "react";

/**
 * Query which fetches and holds a channel's data
 */
export function useChannel(id: string | undefined) {
    return useQuery<Channel>(["channels", id], async () => {
        const response = await axiosApi.get(`/channels/${id}`);
        return response.data;
    }, {
        staleTime: 15000,
        enabled: !!id
    });
}

export function useDeleteChannel(data: Channel | undefined) {

    const queryClient = useQueryClient();
    const navigate = useNavigate();

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

    return useCallback(async () => {
        await deleteChannelMutation.mutateAsync();
        navigate("/chats/");
    }, [deleteChannelMutation, navigate]);
}

export function useChangeUserRole(channelId: string | undefined) {

    const queryClient = useQueryClient();

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
            await queryClient.invalidateQueries<Channel>(["channels", channelId]);
        }
    });

    /**
     * Executes the mutation to promote users to moderators.
     * @param url The URL for the user's membership.
     */
    const handleDemoteUser = React.useCallback(async (url: string) =>
            await updateMembershipMutation.mutateAsync({url, role: "U"}),
        [updateMembershipMutation]);

    /**
     * Executes the mutation to demote moderators to regular users.
     * @param url The URL for the user's membership.
     */
    const handlePromoteUser = React.useCallback(async (url: string) =>
            await updateMembershipMutation.mutateAsync({url, role: "M"}),
        [updateMembershipMutation]);

    return useMemo(() => ({
        handlePromoteUser,
        handleDemoteUser
    }), [handleDemoteUser, handlePromoteUser]);
}
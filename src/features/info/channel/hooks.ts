import {useMutation, useQuery, useQueryClient} from "react-query";
import {Channel} from "../../../entities/Channel";
import {axiosApi} from "../../auth/AuthContext";
import {useNavigate} from "react-router-dom";
import {useCallback} from "react";

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
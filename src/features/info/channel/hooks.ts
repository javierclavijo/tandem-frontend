import {useQuery} from "react-query";
import {Channel} from "../../../entities/Channel";
import {axiosApi} from "../../auth/AuthContext";

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

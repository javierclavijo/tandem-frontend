import {useQuery} from "react-query";
import {User} from "../../../entities/User";
import {axiosApi} from "../../auth/AuthContext";

/**
 * Holds a user's data
 */
export function useUser(id: string | undefined) {
    return useQuery<User>(["users", id], async () => {
        const response = await axiosApi.get(`/users/${id}`);
        return response.data;
    }, {
        staleTime: 15000,
        enabled: !!id
    });
}

import {useMutation, useQuery, useQueryClient} from "react-query";
import {User, UserLanguage} from "../../../entities/User";
import useAuth, {axiosApi} from "../../auth/AuthContext";
import React from "react";

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

export function useDeleteUserLanguage(selectedDeleteLanguage: UserLanguage | null,
                                      setSelectedDeleteLanguage: React.Dispatch<React.SetStateAction<UserLanguage | null>>) {
    const queryClient = useQueryClient();
    const {user} = useAuth();

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

    return React.useCallback(async () => {
        if (selectedDeleteLanguage) {
            await deleteMutation.mutateAsync(selectedDeleteLanguage.url);
            setSelectedDeleteLanguage(null);
        }
    }, [deleteMutation, selectedDeleteLanguage, setSelectedDeleteLanguage]);
}
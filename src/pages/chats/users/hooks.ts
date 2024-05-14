import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axiosApi } from "../../../App";
import { User } from "../../../common/types";
import useAuth from "../../auth/AuthContext";

/**
 * Holds a user's data
 */
export function useUser(id: string | undefined) {
  return useQuery<User>(
    ["users", id],
    async () => {
      const response = await axiosApi.get(`users/${id}`);
      return response.data;
    },
    {
      enabled: !!id,
    },
  );
}

export function useDeleteUserLanguage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  /**
   * Delete-related functions
   */
  const deleteRequest = async (url: string) => {
    const response = await axiosApi.delete(url);
    return response.data;
  };

  return useMutation(deleteRequest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries<User | undefined>([
        "users",
        user?.id,
      ]);
    },
  });
}

export function useCreateChatWithUser(otherUser: User | undefined) {
  const queryClient = useQueryClient();

  /**
   * Creates a chat for the current user with the provided user.
   */
  const createChatRequest = React.useCallback(async () => {
    if (otherUser) {
      return await axiosApi.post("friend_chats/", { users: [otherUser.id] });
    }
  }, [otherUser]);

  /**
   * Sends the request to create the chat with the user.
   */
  return useMutation(createChatRequest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["users", otherUser?.id]);
      await queryClient.invalidateQueries(["chats", "list", "all"]);
    },
  });
}

import { AxiosError, AxiosResponse } from "axios";
import { useCallback } from "react";
import {
  UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { axiosApi } from "../../../common/apis";
import useAuth from "../../../common/context/AuthContext/AuthContext";
import {
  ProficiencyLevel,
  ServerErrorResponse,
  User,
} from "../../../common/types";
import { UserLanguage } from "../types";
import { CreateUserLanguageRequestData, SetPasswordRequestData } from "./types";

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
  const createChatRequest = useCallback(async () => {
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

async function setPasswordRequest(data: SetPasswordRequestData) {
  return await axiosApi.patch<User>("set_password/", data);
}

export function useSetPasswordMutation(
  options: Omit<
    UseMutationOptions<
      AxiosResponse<User>,
      AxiosError<ServerErrorResponse>,
      SetPasswordRequestData,
      unknown
    >,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: setPasswordRequest,
    ...options,
  });
}

async function createUserLanguageRequest(
  requestData: CreateUserLanguageRequestData,
) {
  const response = await axiosApi.post<UserLanguage>(
    "user_languages/",
    requestData,
  );
  return response.data;
}

export function useCreateUserLanguageMutation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation(createUserLanguageRequest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries<User | undefined>(["users", userId]);
    },
  });
}

export function useUpdateUserLanguageMutation(userLanguageUrl: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const updateRequest = async (requestData: { level: ProficiencyLevel }) =>
    await axiosApi.patch(userLanguageUrl, requestData);

  return useMutation(updateRequest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries<User | undefined>([
        "users",
        user?.id,
      ]);
    },
  });
}

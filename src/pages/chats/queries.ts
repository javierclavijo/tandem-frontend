import { useMemo } from "react";
import {
  UseInfiniteQueryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { axiosApi } from "../../api";
import { Channel, Chat, User } from "../../common/types";
import useAuth from "../auth/AuthContext/AuthContext";
import { getFriendFromFriendChat, messageSortFn } from "./hooks";
import {
  ChatMessageResponse,
  UpdateChannelDescriptionQueryKey,
  UpdateChannelDescriptionRequest,
} from "./types";

export const fetchAllChatList = async (user: User | undefined) => {
  const friendChats = await fetchFriendChatList(user);
  const channelChats = await fetchChannelChatList(user);
  return [...friendChats, ...channelChats];
};

/**
 * Holds information about the user's chat list (both channel and friend chats).
 */
export const useAllChatList = () => {
  const { user } = useAuth();
  return useQuery<Chat[]>(
    ["chats", "list", "all"],
    () => fetchAllChatList(user),
    {
      // Whenever data is either fetched or updated with setQueryData(), sort
      // chats according to their latest messages
      onSuccess: (data) =>
        data.sort((a, b) => messageSortFn(a.messages[0], b.messages[0])),
      staleTime: 15000,
      enabled: !!user,
    },
  );
};

/**
 * Holds information about a chat and its messages.
 */
export const useChat = (
  id: string,
  queryOptions: UseInfiniteQueryOptions<ChatMessageResponse> | undefined,
) => {
  const { data: chatList } = useAllChatList();

  const chat: Chat | undefined = useMemo(
    () => chatList?.find((c) => c.id === id),
    [chatList, id],
  );

  const query = useInfiniteQuery<ChatMessageResponse>(
    ["chats", "messages", chat?.id],
    async ({ pageParam = 1 }) => {
      if (chat) {
        const response = await axiosApi.get(chat?.messageUrl, {
          params: { page: pageParam },
        });
        return response.data;
      }
      return undefined;
    },
    {
      ...queryOptions,
      enabled: !!chat?.id,
      getPreviousPageParam: (firstPage) =>
        firstPage.previousPageNumber ?? undefined,
      getNextPageParam: (lastPage) => lastPage.nextPageNumber ?? undefined,
    },
  );

  return { ...query, chat };
};

export const fetchFriendChatList = async (user: User | undefined) => {
  if (user) {
    const friendChatsResponse = await axiosApi.get(`friend_chats/`, {
      params: {
        users: user.id,
        size: 99,
      },
    });
    // Add additional info to each chat (type, the other user's name, info URL
    // and image)
    return [...friendChatsResponse.data.results].map((chat) => {
      const other_user = getFriendFromFriendChat(user, chat);
      return {
        ...chat,
        type: "users",
        name: other_user?.username,
        infoUrl: other_user?.url,
        image: other_user?.image,
      };
    });
  }
  return [];
};

/**
 * Holds information about the user's friend chat list.
 */
export const useFriendChatList = () => {
  const { user } = useAuth();
  return useQuery<Chat[]>(
    ["chats", "list", "users"],
    () => fetchFriendChatList(user),
    {
      // Whenever data is either fetched or updated with setQueryData(),
      // sort chats according to their latest messages
      onSuccess: (data) =>
        data.sort((a, b) => messageSortFn(a.messages[0], b.messages[0])),
      staleTime: 15000,
      enabled: !!user,
    },
  );
};

export const fetchChannelChatList = async (user: User | undefined) => {
  if (user) {
    const channelChatsResponse = await axiosApi.get(`channels/`, {
      params: {
        memberships__user: user.id,
        size: 9999,
      },
    });
    // Add additional info to each chat (type, the channel's URL as the info
    // URL)
    return [...channelChatsResponse.data.results].map((chat) => ({
      ...chat,
      type: "channels",
      infoUrl: chat.url,
    }));
  }
  return [];
};

/**
 * Holds information about the user's channel chat list.
 */
export const useChannelChatList = () => {
  const { user } = useAuth();
  return useQuery<Chat[]>(
    ["chats", "list", "channels"],
    () => fetchChannelChatList(user),
    {
      // Whenever data is either fetched or updated with setQueryData(), sort
      // chats according to their latest messages
      onSuccess: (data) =>
        data.sort((a, b) => messageSortFn(a.messages[0], b.messages[0])),
      staleTime: 15000,
      enabled: !!user,
    },
  );
};

export const useUpdateChannelNameMutation = (data: Channel) => {
  const queryClient = useQueryClient();

  const updateRequest = async (requestData: { name: string }) => {
    const response = await axiosApi.patch(data.url, requestData);
    return response.data;
  };

  return useMutation(updateRequest, {
    onSuccess: async (requestData) => {
      // Update chat data in the channel's detail query, and also in the chat list and chat detail queries, to
      // update the header and the chat list
      queryClient.setQueryData<Channel | undefined>(
        ["channels", data?.id],
        (old) => {
          if (old) {
            old.name = requestData.name;
          }
          return old;
        },
      );
      queryClient.setQueryData<Chat[] | undefined>(
        ["chats", "list", "all"],
        (old) => {
          const oldChat = old?.find((chat) => chat.id === requestData.id);
          if (oldChat) {
            oldChat.name = requestData.name;
          }
          return old;
        },
      );
      queryClient.setQueryData<Chat | undefined>(
        ["chats", "messages", requestData.id],
        (old) => {
          if (old) {
            old.name = requestData.name;
          }
          return old;
        },
      );
    },
  });
};

export const useUpdateUsernameMutation = (data: User) => {
  const queryClient = useQueryClient();

  const updateRequest = async (requestData: { username: string }) => {
    const response = await axiosApi.patch(data.url, requestData);
    return response.data;
  };

  return useMutation(updateRequest, {
    onSuccess: async (requestData) => {
      // Update chat data in the user's query
      queryClient.setQueryData<User | undefined>(["users", data.id], (old) => {
        if (old) {
          old.username = requestData.username;
        }
        return old;
      });
    },
  });
};

export const useUpdateChannelDescriptionMutation = (
  data: Channel | User,
  queryKey: UpdateChannelDescriptionQueryKey,
) => {
  const queryClient = useQueryClient();

  const updateRequest = async (
    requestData: UpdateChannelDescriptionRequest,
  ) => {
    const response = await axiosApi.patch(data?.url, requestData);
    return response.data;
  };

  return useMutation(updateRequest, {
    onSuccess: async (requestData) => {
      queryClient.setQueryData<Channel | undefined>(
        [queryKey, data?.id],
        (old) => {
          if (old) {
            old.description = requestData.description;
          }
          return old;
        },
      );
    },
  });
};

export const useUpdateImage = (
  url: string,
  invalidateQueryKey: string | unknown[],
) => {
  const queryClient = useQueryClient();

  const request = async (data: FormData) => {
    const response = await axiosApi.patch(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  return useMutation(request, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(invalidateQueryKey);
    },
  });
};

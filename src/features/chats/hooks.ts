import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
} from "react-query";
import { Chat, FriendChat } from "../../entities/Chat";
import useAuth, { axiosApi } from "../auth/AuthContext";
import { ChatMessage, ChatMessageResponse } from "../../entities/ChatMessage";
import { DateTime } from "luxon";
import React, { useCallback, useState } from "react";
import { User } from "../../entities/User";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChatHeaderProps } from "../../components/ChatHeader";
import useWebSocket from "react-use-websocket";

/**
 * Sorts messages or chats according to sent datetime. If the message is undefined (usually due to a chat having
 * no messages, which shouldn't happen in practice), the current datetime is used.
 */
export const messageSortFn = (
  a: ChatMessage | undefined,
  b: ChatMessage | undefined
) => {
  const aDateTime = a?.timestamp
    ? DateTime.fromISO(a.timestamp)
    : DateTime.now();
  const bDateTime = b?.timestamp
    ? DateTime.fromISO(b.timestamp)
    : DateTime.now();

  if (aDateTime > bDateTime) {
    return -1;
  } else if (bDateTime > aDateTime) {
    return 1;
  } else {
    return 0;
  }
};

export const getFriendFromFriendChat = (user: User, chat: FriendChat) =>
  chat.users.find((u: User) => u.id !== user.id);

const fetchFriendChatList = async (user: User | undefined) => {
  if (user) {
    const friendChatsResponse = await axiosApi.get(`friend_chats/`, {
      params: {
        users: user.id,
        size: 9999,
      },
    });
    // Add additional info to each chat (type, the other user's name, info URL and image)
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

const fetchChannelChatList = async (user: User | undefined) => {
  if (user) {
    const channelChatsResponse = await axiosApi.get(`channels/`, {
      params: {
        memberships__user: user.id,
        size: 9999,
      },
    });
    // Add additional info to each chat (type, the channel's URL as the info URL)
    return [...channelChatsResponse.data.results].map((chat) => ({
      ...chat,
      type: "channels",
      infoUrl: chat.url,
    }));
  }
  return [];
};

const fetchAllChatList = async (user: User | undefined) => {
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
      // Whenever data is either fetched or updated with setQueryData(), sort chats according to their latest messages
      onSuccess: (data) =>
        data.sort((a, b) => messageSortFn(a.messages[0], b.messages[0])),
      staleTime: 5000,
      enabled: !!user,
    }
  );
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
      // Whenever data is either fetched or updated with setQueryData(), sort chats according to their latest messages
      onSuccess: (data) =>
        data.sort((a, b) => messageSortFn(a.messages[0], b.messages[0])),
      staleTime: 5000,
      enabled: !!user,
    }
  );
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
      // Whenever data is either fetched or updated with setQueryData(), sort chats according to their latest messages
      onSuccess: (data) =>
        data.sort((a, b) => messageSortFn(a.messages[0], b.messages[0])),
      staleTime: 5000,
      enabled: !!user,
    }
  );
};

/**
 * Holds information about a chat and its messages.
 */
export const useChat = (
  id: string,
  queryOptions: Omit<UseInfiniteQueryOptions, any> | undefined
) => {
  const navigate = useNavigate();
  const { data: chatList } = useAllChatList();
  const [chat, setChat] = useState<Chat | undefined>();

  React.useLayoutEffect(() => {
    // Fetch the resource's URL and ID from the chat list
    const chatResult = chatList?.find((c) => c.id === id);
    if (chatResult) {
      setChat(chatResult);
    } else {
      navigate("/404");
    }
  }, [chatList, id, navigate]);

  const query = useInfiniteQuery<ChatMessageResponse>(
    ["chats", "messages", chat?.id],
    async ({ pageParam = 1 }) => {
      if (chat) {
        const response = await axiosApi.get(
          chat?.messageUrl + `&page=${pageParam}`
        );
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
    }
  );

  return { ...query, chat };
};

/**
 * Sets the chat header according to the current view's resource's data. Used in ChatRoom component.
 */
export const useSetChatRoomHeader = (chat: Chat | undefined | null) => {
  const { user } = useAuth();
  const [, setHeader] =
    useOutletContext<
      [
        ChatHeaderProps | null,
        React.Dispatch<React.SetStateAction<ChatHeaderProps | null>>
      ]
    >();

  return React.useEffect(() => {
    if (chat) {
      let headerProps;
      if (chat.type === "users") {
        const friend = getFriendFromFriendChat(user!, chat as FriendChat);
        headerProps = {
          link: `/chats/users/${friend?.id}`,
          title: friend?.username,
          image: friend?.image,
        };
      } else {
        headerProps = {
          link: `/chats/channels/${chat.id}`,
          title: chat.name,
          image: chat.image,
        };
      }
      setHeader(headerProps);
    }
  }, [chat, setHeader, user]);
};

/**
 * Sends a message through the WS connection when a chat is created to join the chat group.
 * The connection is closed if the user logs out.
 */
export function useJoinWSChat() {
  const { isLoggedIn } = useAuth();

  const { sendJsonMessage } = useWebSocket(
    `${process.env.REACT_APP_WS_URL}/ws/chats/`,
    {
      onClose: () => console.error("Chat socket closed unexpectedly"),
      shouldReconnect: () => true,
      share: true,
    },
    isLoggedIn
  );

  return useCallback(
    (id: string) => {
      const message = {
        chat_id: id,
        type: "join_chat",
      };
      sendJsonMessage(message);
    },
    [sendJsonMessage]
  );
}

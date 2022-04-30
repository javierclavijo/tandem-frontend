import {useInfiniteQuery, UseInfiniteQueryOptions, useQuery} from "react-query";
import {Chat, FriendChat} from "../../entities/Chat";
import useAuth, {axiosApi} from "../auth/AuthContext";
import {ChatMessage, ChatMessageResponse} from "../../entities/ChatMessage";
import {DateTime} from "luxon";
import React, {useState} from "react";
import {User} from "../../entities/User";
import {useOutletContext} from "react-router-dom";
import {ChatHeaderProps} from "../../components/ChatHeader";

export const messageSortFn = (a: ChatMessage, b: ChatMessage) => {
    const aDateTime = DateTime.fromISO(a.timestamp);
    const bDateTime = DateTime.fromISO(b.timestamp);

    if (aDateTime > bDateTime) {
        return -1;
    } else if (bDateTime > aDateTime) {
        return 1;
    } else {
        return 0;
    }
};

export const getFriendFromFriendChat = (user: User, chat: FriendChat) => chat.users.find((u: User) => u.id !== user.id);

const fetchChatList = async (user: User | undefined) => {
    if (user) {
        const friendChatsResponse = await axiosApi.get(`/friend_chats/?users=${user.id}`);
        // Add additional info to each chat (type, the other user's name, info URL and image)
        const friendChats: Chat[] = [...friendChatsResponse.data.results].map(chat => {
            const other_user = getFriendFromFriendChat(user, chat);
            return {
                ...chat,
                type: "users",
                name: other_user?.username,
                infoUrl: other_user?.url,
                image: other_user?.image
            };
        });
        const channelChatsResponse = await axiosApi.get(`/channels/?memberships__user=${user.id}`);
        // Add additional info to each chat (type, the channel's URL as the info URL)
        const channelChats: Chat[] = [...channelChatsResponse.data.results].map(chat => {
            return {
                ...chat,
                type: "channels",
                infoUrl: chat.url
            };
        });
        return [...friendChats, ...channelChats];
    }
    return [];
};

export const useChatList = () => {
    /**
     * Holds the information about the user's chat list.
     */
    const {user} = useAuth();
    return useQuery<Chat[]>(["chats", "list"], () => fetchChatList(user), {
        // Whenever data is either fetched or updated with setQueryData(), sort chats according to their latest messages
        onSuccess: (data) => data.sort((a, b) => messageSortFn(a.messages[0], b.messages[0])),
        staleTime: 15000,
        enabled: !!user
    });
};

export const useChat = (id: string,
                        queryOptions: Omit<UseInfiniteQueryOptions, any> | undefined) => {
    /**
     * Holds the information about a chat and its messages.
     */

    const {data: chatList} = useChatList();
    const [chat, setChat] = useState<Chat | undefined>();

    React.useLayoutEffect(() => {
        // Fetch the resource's URL and ID from the chat list
        const chatResult = chatList?.find(c => c.id === id);
        if (chatResult) {
            setChat(chatResult);
        }
    }, [chatList, id]);

    const query = useInfiniteQuery<ChatMessageResponse>(["chats", "messages", chat?.id], async ({pageParam = 1}) => {
            if (chat) {
                const response = await axiosApi.get(chat?.messageUrl + `&page=${pageParam}`);
                return response.data;
            }
            return undefined;
        }, {
            ...queryOptions,
            enabled: !!chat?.id,
            getPreviousPageParam: firstPage => firstPage.previousPageNumber ?? undefined,
            getNextPageParam: lastPage => lastPage.nextPageNumber ?? undefined
        }
    );

    return {...query, chat};
};

export const useSetChatRoomHeader = (chat: Chat | undefined | null) => {
    /**
     * Sets the chat header according to the current view's resource's data. Used in ChatRoom component.
     */

    const {user} = useAuth();
    const [, setHeader] = useOutletContext<[ChatHeaderProps | null, React.Dispatch<React.SetStateAction<ChatHeaderProps | null>>]>();

    return React.useEffect(() => {
        if (chat) {
            let headerProps;
            if (chat.type === "users") {
                const friend = getFriendFromFriendChat(user!, chat as FriendChat);
                headerProps = {
                    link: `/chats/users/${friend?.id}`,
                    title: friend?.username,
                    image: friend?.image
                };
            } else {
                headerProps = {
                    link: `/chats/channels/${(chat.id)}`,
                    title: chat.name,
                    image: chat.image
                };
            }
            setHeader(headerProps);
        }
    }, [chat, setHeader, user]);
};

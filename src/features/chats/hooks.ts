import {QueryKey, useQuery, UseQueryOptions} from "react-query";
import {Chat} from "../../entities/Chat";
import useAuth, {axiosApi} from "../auth/AuthContext";
import {ChatMessage, ChatMessageResponse} from "../../entities/ChatMessage";
import {DateTime} from "luxon";
import React, {useState} from "react";
import {User} from "../../entities/User";

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

const fetchChatList = async (user: User | undefined) => {
    if (user) {
        const userChatsResponse = await axiosApi.get(`/user_chats/?users=${user.id}`);
        // Add additional info to each chat (type, the other user's name and the other user's info URL)
        const userChats: Chat[] = [...userChatsResponse.data.results].map(chat => {
            const other_user = chat.users.find((u: User) => u.id !== user.id);
            return {
                ...chat,
                type: "users",
                name: other_user.username,
                infoUrl: other_user.url
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
        return [...userChats, ...channelChats];
    }
    return [];
};

export const useChatList = () => {
    const {user} = useAuth();
    return useQuery<Chat[]>(["chats", "list"], () => fetchChatList(user), {
        // Whenever data is either fetched or updated with setQueryData(), sort chats according to their latest messages
        onSuccess: (data) => data.sort((a, b) => messageSortFn(a.messages[0], b.messages[0])),
        staleTime: 15000,
        enabled: !!user
    });
};

export const useChat = (id: string,
                        queryOptions: Omit<UseQueryOptions<ChatMessageResponse, unknown, ChatMessageResponse, QueryKey>,
                            "queryKey" | "queryFn"> | undefined) => {
    // Hook which holds the information about a chat and its messages.

    const {data: chatList} = useChatList();
    const [chat, setChat] = useState<Chat | undefined>();

    React.useLayoutEffect(() => {
        // Fetch the resource's URL and ID from the chat list
        const chatResult = chatList?.find(c => c.id === id);
        if (chatResult) {
            setChat(chatResult);
        }
    }, [chatList, id]);

    const query = useQuery<ChatMessageResponse>(["chats", "messages", chat?.id], async () => {
            if (chat) {
                const response = await axiosApi.get(chat?.messageUrl);
                return response.data;
            }
            return undefined;
        }, {
            ...queryOptions,
            enabled: !!chat?.id,
        }
    );

    return {...query, chat};
};

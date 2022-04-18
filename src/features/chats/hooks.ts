import {QueryKey, useQuery, UseQueryOptions} from "react-query";
import {Chat} from "../../entities/Chat";
import {axiosApi} from "../auth/AuthContext";
import {ChatMessage} from "../../entities/ChatMessage";
import {DateTime} from "luxon";
import React, {useState} from "react";

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

const fetchChatList = async () => {
    const userChatsResponse = await axiosApi.get("/user_chats");
    const channelChatsResponse = await axiosApi.get("/channel_chats");
    return [...userChatsResponse.data.results, ...channelChatsResponse.data.results];
};

export const useChatList = () => {
    return useQuery<Chat[]>(["chats", "list"], fetchChatList, {
        // Whenever data is either fetched or updated with setQueryData(), sort chats according to their latest messages
        onSuccess: (data) => data.sort((a, b) => messageSortFn(a.messages[0], b.messages[0])),
        staleTime: 15000,
    });
};

export const useChat = (id: string,
                        queryOptions: Omit<UseQueryOptions<Chat, unknown, Chat, QueryKey>,
                            "queryKey" | "queryFn"> | undefined) => {
    const {data: chatList} = useChatList();
    const [chat, setChat] = useState<Chat>({} as Chat);

    React.useLayoutEffect(() => {
        // Fetch the resource's URL and ID from the chat list
        const chatResult = chatList?.find(c => c.id === id);
        if (chatResult) {
            setChat(chatResult);
        }
    }, [chatList, id]);

    return useQuery<Chat>(["chats", "detail", chat.id], async () => {
            const response = await axiosApi.get(chat.url);
            return response.data;
        }, {...queryOptions, enabled: Boolean(chat.id)}
    );
};

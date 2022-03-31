import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {RootState} from "../store";
import {Chat} from "../../entities/Chat";

export interface UserResponse {
    token: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface ChatListResponse {
    results: Chat[];
}

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_URL as string,
        prepareHeaders: (headers, {getState}) => {
            // By default, if we have a token in the store, let's use that for authenticated requests
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set("Authorization", `Token ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<UserResponse, LoginRequest>({
            query: (credentials) => ({
                url: "/api-token-auth/",
                method: "POST",
                body: credentials,
            }),
        }),
        getChatList: builder.query<Chat[], void>({
            async queryFn(_arg, queryAou, _extraOptions, fetchWithBQ) {
                // Fetch both user and channel chats, then add them to a list and return that list
                const chats = [] as Chat[];
                const channelChatResponse = await fetchWithBQ("/channel_chats/");
                if (channelChatResponse.error) {
                    throw channelChatResponse.error;
                }
                const channelChatData = channelChatResponse.data as ChatListResponse;
                chats.push(...channelChatData.results);

                const userChatResponse = await fetchWithBQ("/user_chats/");
                if (userChatResponse.error) {
                    throw userChatResponse.error;
                }
                const userChatData = userChatResponse.data as ChatListResponse;
                chats.push(...userChatData.results);

                return {data: chats};
            }
        })
    }),
});

export const {useLoginMutation, useGetChatListQuery} = api;

// Initial code source: https://codesandbox.io/s/github/reduxjs/redux-toolkit/tree/master/examples/query/react/authentication?from-embed

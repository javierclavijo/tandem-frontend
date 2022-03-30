import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {RootState} from "../store";
import {ChatMessage} from "../../entities/ChatMessage";

export interface UserResponse {
    token: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface ChatListResponse {
    id:number,
    url:string,
    name:string,
    type: "user" | "channel",
    messages: ChatMessage[]
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
        fetchUserChatList: builder.query<ChatListResponse, string>({
            query: () => "/user_chats/",
        }),
        fetchChannelChatList: builder.query<ChatListResponse, string>({
            query: () => "/channel_chats/",
        }),
    }),
});

export const {useLoginMutation, useFetchUserChatListQuery, useFetchChannelChatListQuery} = api;

// Initial code source: https://codesandbox.io/s/github/reduxjs/redux-toolkit/tree/master/examples/query/react/authentication?from-embed

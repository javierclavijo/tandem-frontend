import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {RootState} from "../store";

export interface UserResponse {
    token: string;
}

export interface LoginRequest {
    username: string;
    password: string;
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
    }),
});

export const {useLoginMutation} = api;

// Initial code source: https://codesandbox.io/s/github/reduxjs/redux-toolkit/tree/master/examples/query/react/authentication?from-embed

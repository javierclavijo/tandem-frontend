import axios, { AxiosResponse } from "axios";
import React, { useContext, useDeferredValue, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axiosApi } from "../../../App";
import { User } from "../../../common/types";
import { getSessionInfoFromQueryData } from "./functions";
import {
  AuthContextType,
  LogInRequestData,
  SessionInfoResponse,
} from "./types";

export const AuthContext = React.createContext<AuthContextType>(
  // TODO:review this type assertion
  {} as AuthContextType,
);

// TODO: refactor using RQ

/**
 * Authentication context provider for the app. Fetches and provides information
 * about the user and provides functions to log in and log out.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  /**
   * Fetches the current session's info from the server (user ID and URL, plus
   * CSRF token from the csrftoken cookie) and sets it in the context's state.
   * Runs on init.
   */
  const { data: sessionInfo, isLoading: isSessionInfoLoading } =
    useQuery<SessionInfoResponse>(["sessionInfo"], async () => {
      const response = await axiosApi.get<SessionInfoResponse>("session_info/");
      return response.data;
    });

  const { id, url } = getSessionInfoFromQueryData(sessionInfo);

  /**
   * User query. Is disabled unless the user is logged in (i. e. the session
   * info query has returned the user's ID).
   */
  const { data: user } = useQuery<User>(
    ["users", id],
    async () => {
      const response = await axiosApi.get(url!);
      return response.data;
    },
    {
      enabled: id != null,
    },
  );

  const invalidateUserQueries = () => {
    queryClient.invalidateQueries(["users", id], { exact: true });
    queryClient.invalidateQueries(["sessionInfo"], { exact: true });
  };

  /**
   * Sends a login request.
   */
  const loginMutation = useMutation<
    AxiosResponse<void>,
    Error,
    LogInRequestData
  >(
    async (data: LogInRequestData) => {
      try {
        return await axiosApi.post<void>("login/", data);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 401) {
          throw new Error("Unable to log in with provided credentials.");
        } else {
          throw new Error("Unable to log in.");
        }
      }
    },
    { onSuccess: invalidateUserQueries },
  );

  /**
   * Sends a logout request.
   */
  const logoutMutation = useMutation(
    async () => await axiosApi.post("logout/"),
    { onSuccess: invalidateUserQueries },
  );

  const loading = useDeferredValue(
    isSessionInfoLoading || loginMutation.isLoading || logoutMutation.isLoading,
  );

  const memoedValue: AuthContextType = useMemo(
    () => ({
      user,
      error: loginMutation.error?.message,
      loading,
      isLoggedIn: sessionInfo?.id != null,
      login: loginMutation.mutateAsync,
      logout: logoutMutation.mutateAsync,
    }),
    [
      user,
      loginMutation.error,
      loading,
      sessionInfo?.id,
      loginMutation.mutateAsync,
      logoutMutation.mutateAsync,
    ],
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}

// Code inspired by https://dev.to/finiam/predictable-react-authentication-with-the-context-api-g10,
// https://lo-victoria.com/introduction-to-react-context-api-with-firebase-authentication
// and https://egreb.net/blog/react-auth-with-react-query-and-axios/
